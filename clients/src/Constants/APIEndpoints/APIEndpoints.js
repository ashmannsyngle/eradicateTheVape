export default {
    base: "https://api.eradicatethevape.live",
    testbase: "https://localhost:4000",
    handlers: {
        users: "/v1/users",
        myuser: "/v1/users/me",
        myuserAvatar: "/v1/users/me/avatar",
        sessions: "/v1/sessions",
        marketplace: "/v1/marketplace",
        marketplaceBadges: "/v1/marketplace/",
        threads: "/v1/threads",
        specificThreads: "/v1/threads/",
        posts:"/v1/posts/",
        progress: "/v1/progress",
        sessionsMine: "/v1/sessions/mine",
        resetPasscode: "/v1/resetcodes",
        passwords: "/v1/passwords/"
    }
}