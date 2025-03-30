  ## Vinyl Store Application
  
  This project is a backend application for managing a vinyl record store. It is built using the NestJS framework and includes various modules for handling different aspects of the application such as authentication, orders, profiles, reviews, and more.
  
  ### Why You'll Love This Project:
  
  This Vinyl Store Application is not just another backend project; it's a comprehensive solution designed to bring the joy of vinyl records to life. Built with the robust NestJS framework, this application is a testament to modern web development practices, ensuring scalability, maintainability, and performance.
  
  #### What Sets It Apart:
  - **Cutting-Edge Technology**: Leveraging the power of NestJS, TypeScript, and a suite of modern libraries, this project is at the forefront of backend development.
  - **User-Centric Features**: From seamless authentication to intuitive order management, every feature is designed with the user in mind.
  - **Integration Excellence**: With integrations like Redis for caching, AWS S3 for storage, and Stripe for payments, this application is ready for production environments.
  - **Security First**: Robust security measures, including JWT authentication and OAuth with Google, ensure user data is protected.
  - **Developer Friendly**: Comprehensive scripts and environment variable management make it easy for developers to get started and maintain the project.
  
  #### Impact:
  This project not only showcases technical prowess but also a deep understanding of user needs and market trends. It's a perfect example of how technology can be harnessed to create meaningful and enjoyable user experiences.
  
  #### Join Us:
  Be a part of a project that is not just about code, but about bringing the timeless charm of vinyl records to the digital age. Whether you're a developer, a music enthusiast, or someone who appreciates well-crafted software, this project has something for you.
  
  #### Let's Make Music Together!
  Dive into the code, explore the features, and contribute to a project that harmonizes technology and music in perfect sync.
   
  #### Ready to Spin?
  Get started today and be a part of the Vinyl Store Application journey. Your next favorite project awaits!
  
  #### Contact:
  For any inquiries or contributions, feel free to reach out. Let's connect and create something amazing together!
  
  #### Thank You:
  Thank you for considering this project. We look forward to your feedback and contributions.
  
  #### Happy Coding!
  
   
  ### Key Features:
  - **Authentication**: Handles user registration, login, logout, and OAuth with Google.
  - **Orders**: Manages the creation and processing of orders.
  - **Profiles**: Allows users to manage their profiles.
  - **Vinyls**: Manages vinyl records, including searching and CRUD operations.
  - **Reviews**: Allows users to review vinyl records.
  - **Logs**: Provides logging functionality.
  - **Redis Integration**: Uses Redis for caching and other purposes.
  - **AWS S3 Integration**: Manages file storage using AWS S3.
  - **Stripe Integration**: Handles payment processing with Stripe.
  
  ### Environment Variables:
  - `DATABASE_URL`: Connection string for the main database.
  - `SHADOW_DATABASE_URL`: Connection string for the shadow database.
  - `CONSUMER_KEY`, `CONSUMER_SECRET`, `DISCOGS_TOKEN`, `SELLER_USERNAME`, `DISCOGS_API_URL`: Discogs API credentials and settings.
  - `JWT_SECRET`: Secret key for JWT authentication.
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`: Google OAuth credentials.
  - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis connection settings.
  - `AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, `BUCKET_NAME_S3`: AWS S3 credentials and bucket name.
  - `STRIPE_API_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `STRIPE_CURRENCY`, `STRIPE_WEBHOOK_SECRET`: Stripe payment settings.
  - `EMAIL`, `PASSWORD`: Email credentials for sending notifications.
  - `TELEGRAM_BOT_TOKEN`: Token to your telegram bot.
  - `TELEGRAM_CHANNEL_ID`: Id of your char or channel in the telegram.
  
  ### Scripts:
  - `build`: Builds the application.
  - `format`: Formats the code using Prettier.
  - `start`: Starts the application.
  - `start:dev`: Starts the application in development mode.
  - `start:debug`: Starts the application in debug mode.
  - `start:prod`: Starts the application in production mode.
  - `lint`: Lints the code using ESLint.
  - `migrate`: Runs database migrations.
  - `seed`: Seeds the database.
  - `test`: Runs tests.
  - `test:watch`: Runs tests in watch mode.
  - `test:cov`: Runs tests and generates coverage reports.
  - `test:debug`: Runs tests in debug mode.
  - `test:e2e`: Runs end-to-end tests.
  
  ### Dependencies:
  - Various NestJS modules and other libraries for handling authentication, database interactions, Redis, AWS S3, Stripe, and more.
  
  ### Dev Dependencies:
  - Tools for development such as TypeScript, ESLint, Prettier, Jest, and more.
  
  ### Notes:
  - The AWS SDK for JavaScript (v2) is in maintenance mode. It is recommended to migrate to AWS SDK for JavaScript (v3).
 /
