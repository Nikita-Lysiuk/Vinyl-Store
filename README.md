 * ## Vinyl Store Application
 * 
 * This project is a backend application for managing a vinyl record store. It is built using the NestJS framework and includes various modules for handling different aspects of the application such as authentication, orders, profiles, reviews, and more.
 * 
 * ### Key Features:
 * - **Authentication**: Handles user registration, login, logout, and OAuth with Google.
 * - **Orders**: Manages the creation and processing of orders.
 * - **Profiles**: Allows users to manage their profiles.
 * - **Vinyls**: Manages vinyl records, including searching and CRUD operations.
 * - **Reviews**: Allows users to review vinyl records.
 * - **Logs**: Provides logging functionality.
 * - **Redis Integration**: Uses Redis for caching and other purposes.
 * - **AWS S3 Integration**: Manages file storage using AWS S3.
 * - **Stripe Integration**: Handles payment processing with Stripe.
 * 
 * ### Environment Variables:
 * - `DATABASE_URL`: Connection string for the main database.
 * - `SHADOW_DATABASE_URL`: Connection string for the shadow database.
 * - `CONSUMER_KEY`, `CONSUMER_SECRET`, `DISCOGS_TOKEN`, `SELLER_USERNAME`, `DISCOGS_API_URL`: Discogs API credentials and settings.
 * - `JWT_SECRET`: Secret key for JWT authentication.
 * - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`: Google OAuth credentials.
 * - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis connection settings.
 * - `AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, `BUCKET_NAME_S3`: AWS S3 credentials and bucket name.
 * - `STRIPE_API_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `STRIPE_CURRENCY`, `STRIPE_WEBHOOK_SECRET`: Stripe payment settings.
 * - `EMAIL`, `PASSWORD`: Email credentials for sending notifications.
 * - `TELEGRAM_BOT_TOKEN`: Token to your telegram bot.
 * - `TELEGRAM_CHANNEL_ID`: Id of your char or channel in the telegram.
 * 
 * ### Scripts:
 * - `build`: Builds the application.
 * - `format`: Formats the code using Prettier.
 * - `start`: Starts the application.
 * - `start:dev`: Starts the application in development mode.
 * - `start:debug`: Starts the application in debug mode.
 * - `start:prod`: Starts the application in production mode.
 * - `lint`: Lints the code using ESLint.
 * - `migrate`: Runs database migrations.
 * - `seed`: Seeds the database.
 * - `test`: Runs tests.
 * - `test:watch`: Runs tests in watch mode.
 * - `test:cov`: Runs tests and generates coverage reports.
 * - `test:debug`: Runs tests in debug mode.
 * - `test:e2e`: Runs end-to-end tests.
 * 
 * ### Dependencies:
 * - Various NestJS modules and other libraries for handling authentication, database interactions, Redis, AWS S3, Stripe, and more.
 * 
 * ### Dev Dependencies:
 * - Tools for development such as TypeScript, ESLint, Prettier, Jest, and more.
 * 
 * ### Notes:
 * - The AWS SDK for JavaScript (v2) is in maintenance mode. It is recommended to migrate to AWS SDK for JavaScript (v3).
 */
