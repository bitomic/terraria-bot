-- CreateTable
CREATE TABLE `TriviaStats` (
    `channel` VARCHAR(191) NOT NULL,
    `downvotes` INTEGER NOT NULL DEFAULT 0,
    `message` VARCHAR(191) NOT NULL,
    `upvotes` INTEGER NOT NULL DEFAULT 0,
    `user` VARCHAR(191) NOT NULL,

    INDEX `TriviaStats_user_idx`(`user`),
    PRIMARY KEY (`message`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
