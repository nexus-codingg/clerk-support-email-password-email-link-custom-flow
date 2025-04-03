# clerk-support-email-password-email-link-custom-flow

This is a simple Next.js App Router application that implements authentication using Clerk's custom email + password and magic link flows and dedicated sign-in and sign-up forms.

# Related Clerk Documentation 
- [Build a custom email/password authentication flow](https://clerk.com/docs/custom-flows/email-password)
- [Build a custom flow for handling email links](https://clerk.com/docs/custom-flows/email-links)
- [Build your own sign-up page for your Next.js app with Clerk](https://clerk.com/docs/references/nextjs/custom-sign-up-page)

1. Clone the repository:
   ```sh
   git clone git@github.com:nexus-codingg/clerk-support-email-password-email-link-custom-flow.git
   cd clerk-custom-flow-email-pw-magic-links
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Rename `.env.example` to `.env.local`
   - Add your Clerk API keys from the [Clerk Dashboard](https://dashboard.clerk.com/)
   - In your Clerk Dashboard -> Configure -> Email, phone, username page, ensure that you the following settings enabled: [Image of Clerk Dashboard settings](image/clerk_dashboard_settings.png)

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`

6. Create a user via the "Sign-Up" link

7. You should get an email verification link sent to the email address entered

8. Once the link is clicked, you'll see a success message on the `/verify` page and you will be signed in with the user button visible in the original tab opened.

Note: This sign-up flow does 3 things:
1. Verifies the user's email
2. Sets email + password as a first factor
3. Sets an email link as a first factor

For the sign-in flow, you can either sign-in using only email+pass or only email link. There is code in the `app/sign-up/[[...sign-up]]/page.tsx` page for both methods.

Note: This example repo does not have bot protection code so there will be an error message in the console. To add bot protection to this custom flow, please visit our [Add bot protection to your custom sign-up flow](https://clerk.com/docs/custom-flows/bot-sign-up-protection) guide

## License
This project is licensed under the MIT License.

## Acknowledgments
- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)


