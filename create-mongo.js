db.createUser(
    {
        user: "guy",
        pwd: "guy",
        roles: [
            {
                role: "readWrite",
                db: "test_db"
            }
        ]
    }
)