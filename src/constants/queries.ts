export const FIND_ALL_USER = `
SELECT 
    "user".id, 
    "user"."firstName", 
        "user"."lastName",
            "user"."email",
                "user"."createdAt",
                "user"."updatedAt",   
    post.title, 
    latest_comment.content
FROM "user"
LEFT JOIN post 
    ON "user".id = post."userId"
LEFT JOIN (
    SELECT "postId", content, "createdAt"
    FROM comment c1
    WHERE c1."createdAt" = (
        SELECT MAX(c2."createdAt")
        FROM comment c2
        WHERE c2."postId" = c1."postId"
    )
) AS latest_comment 
    ON post.id = latest_comment."postId"
ORDER BY (
    SELECT COUNT(post.id) 
    FROM post 
    WHERE post."userId" = "user".id
) DESC
LIMIT 3;

`;