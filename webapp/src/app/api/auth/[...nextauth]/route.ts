// imports
import NextAuth from "next-auth"

// importing providers
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: { params: { scope: 'email https://www.googleapis.com/auth/calendar'} },
        })
    ]
})

export { handler as GET, handler as POST }