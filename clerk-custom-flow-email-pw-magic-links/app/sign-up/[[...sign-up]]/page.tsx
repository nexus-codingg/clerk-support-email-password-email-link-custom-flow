"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState("");
  const [verified, setVerified] = React.useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const { startEmailLinkFlow } = signUp.createEmailLinkFlow();

  // Handle submission of the sign-up form
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Reset states in case user resubmits form mid sign-up
    setVerified(false);
    setError("");

    setVerifying(true);

    if (!isLoaded && !signUp) return null;

    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Dynamically set the host domain for dev and prod
      // You could instead use an environment variable or other source for the host domain
      const protocol = window.location.protocol;
      const host = window.location.host;

      // Send the user an email with the email link
      const signUpAttempt = await startEmailLinkFlow({
        // URL to navigate to after the user visits the link in their email
        redirectUrl: `${protocol}//${host}/sign-up/verify`,
      });

      // Check the verification result
      const verification = signUpAttempt.verifications.emailAddress;

      // Handle if user visited the link and completed sign-up from /sign-up/verify and redirect to homepage
      if (
        verification.verifiedFromTheSameClient() &&
        verification.status === "verified"
      ) {
        setVerifying(false);
        setVerified(true);
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));

      if (err.errors?.[0]?.longMessage) {
        console.log("Clerk error:", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      } else {
        setError("An error occurred.");
      }
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(false);
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => setError("")}>Try again</button>
      </div>
    );
  }

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div>
        <p>Check your email and visit the link that was sent to you.</p>
        <form onSubmit={reset}>
          <button type="submit">Restart</button>
        </form>
      </div>
    );
  }

  // if (verified) {
  //   return <div>Signed up successfully!</div>
  // }

  // Display the initial sign-up form to capture the email and password
  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="email">Enter email address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Enter password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Continue</button>
        </div>
      </form>
    </>
  );
}
