// the sign-in page can either do:
// 1.) Sign in with only email+pass
// 2.) Sign in with only email link
// 3. Allow the user to choose between sign in with email+pass or email link

// this will just have the user sign-in with email+pass: https://clerk.com/docs/custom-flows/email-password#sign-in-flow
// 'use client'

// import * as React from 'react'
// import { useSignIn } from '@clerk/nextjs'
// import { useRouter } from 'next/navigation'

// export default function SignInForm() {
//   const { isLoaded, signIn, setActive } = useSignIn()
//   const [email, setEmail] = React.useState('')
//   const [password, setPassword] = React.useState('')
//   const router = useRouter()

//   // Handle the submission of the sign-in form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!isLoaded) return

//     // Start the sign-in process using the email and password provided
//     try {
//       const signInAttempt = await signIn.create({
//         identifier: email,
//         password,
//       })

//       // If sign-in process is complete, set the created session as active
//       // and redirect the user
//       if (signInAttempt.status === 'complete') {
//         await setActive({ session: signInAttempt.createdSessionId })
//         router.push('/')
//       } else {
//         // If the status is not complete, check why. User may need to
//         // complete further steps.
//         console.error(JSON.stringify(signInAttempt, null, 2))
//       }
//     } catch (err: any) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   }

//   // Display a form to capture the user's email and password
//   return (
//     <>
//       <h1>Sign in</h1>
//       <form onSubmit={(e) => handleSubmit(e)}>
//         <div>
//           <label htmlFor="email">Enter email address</label>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             id="email"
//             name="email"
//             type="email"
//             value={email}
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Enter password</label>
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             id="password"
//             name="password"
//             type="password"
//             value={password}
//           />
//         </div>
//         <button type="submit">Sign in</button>
//       </form>
//     </>
//   )
// }

// uncomment this code if you want the user sign-in with email link: https://clerk.com/docs/custom-flows/email-links#sign-in-flow
// Note: the user will not need to enter their password with this flow
'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { EmailLinkFactor, SignInFirstFactor } from '@clerk/types'
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [emailAddress, setEmailAddress] = React.useState('')
  const [verified, setVerified] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)
  const [error, setError] = React.useState('')
  const { signIn, isLoaded, setActive } = useSignIn()
  const router = useRouter()

  if (!isLoaded) return null

  const { startEmailLinkFlow } = signIn.createEmailLinkFlow()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    // Reset states in case user resubmits form mid sign-in
    setVerified(false)
    setError('')

    if (!isLoaded && !signIn) return null

    // Start the sign-in process using the email provided
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: emailAddress,
      })

      setVerifying(true)

      // Filter the returned array to find the 'email_link' entry
      const isEmailLinkFactor = (factor: SignInFirstFactor): factor is EmailLinkFactor => {
        return factor.strategy === 'email_link'
      }
      const emailLinkFactor = supportedFirstFactors?.find(isEmailLinkFactor)

      if (!emailLinkFactor) {
        setError('Email link factor not found')
        return
      }

      const { emailAddressId } = emailLinkFactor

      // Dynamically set the host domain for dev and prod
      // You could instead use an environment variable or other source for the host domain
      const protocol = window.location.protocol
      const host = window.location.host

      // Send the user an email with the email link
      const signInAttempt = await startEmailLinkFlow({
        emailAddressId,
        redirectUrl: `${protocol}//${host}/sign-in/verify`,
      })

      // Check the verification result
      const verification = signInAttempt.firstFactorVerification

      // Handle if verification expired
      if (verification.status === 'expired') {
        setError('The email link has expired.')
      }

       // Handle if user visited the link and completed sign-up from /sign-up/verify and redirect to homepage
       if (
        verification.verifiedFromTheSameClient() &&
        verification.status === "verified"
      ) {
        setVerifying(false);
        setVerified(true);
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError('An error occurred.')
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(false)
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => setError('')}>Try again</button>
      </div>
    )
  }

  if (verifying) {
    return (
      <div>
        <p>Check your email and visit the link that was sent to you.</p>
        <form onSubmit={reset}>
          <button type="submit">Restart</button>
        </form>
      </div>
    )
  }

  // if (verified) {
  //   return <div>Signed in successfully!</div>
  // }

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  )
}