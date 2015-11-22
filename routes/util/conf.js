 // Configuration for the nodejs server app.
 exports.context = function() {

   if (process.env.DEPLOY_ENVIRONMENT) {
     configuration.currentEnvironment = process.env.DEPLOY_ENVIRONMENT
   }

   console.log("Using the environment: " + configuration.currentEnvironment);
   return configuration[configuration.currentEnvironment];
 }

 var configuration = {
   currentEnvironment: "dev",
   dev: {
     googlesetup: {
       auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
       auth_uri: "https://accounts.google.com/o/oauth2/auth",
       client_email: "",
       client_id: "119283461111-u9f8f4jgkacvocdsbdnv5u1gh73ubgku.apps.googleusercontent.com",
       client_secret: "H9oDB_HecYd7oE28IGeOUe_v",
       client_x509_cert_url: "",
       redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "oob"],
       token_uri: "https://accounts.google.com/o/oauth2/token"
     },
     googletokens: {
       token_type: "Bearer",
       refresh_token: "1/i9d-bkIj72CybGpMGwA25qTs2GZc7Gs7CdnyzB9Ud-Y",
       expiry_date: 1413232433845
     },
     auth0: {
       secret: "YuTlfYWW1PXw_AQt1-EvAWvUrUpwheCjkbF6GbI_1Op5Ml5FYiVEtzLd--OeP38k",
       audience: "zNhY5wesWo8iVMsdRYbM6VVXzeMjts0x"
     },
     s3: {
       folder : "/images",
       bucket: "salsa.local",
       accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAIMKUJAVKMMFQDQYA",
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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",
       region : 'us-east-1'
     },
     SIMULATED_NOW: "2015-03-12T03:00:00-05:00",
     CALENDAR_ID: "project.demonio@gmail.com",
     EVENTS_MAXRESULTS: 200,
     EVENT_SEARCH_TIMEMAX: 7 * 24 * 60 * 60 * 1000,
     LOCATIONS_MAXRESULTS: 200,
     MONGO_CONNECTION: process.env.MONGO_CONNECTION || 'localhost:27017',
     UPDATE_MIN_SUBSTRACTION: 60 * 30 * 24 * 60 * 60 * 1000,
     MAX_REPETITIVE_EVENT: 2,
     SYNC_SEASON_START_SEQ: 2,
     SYNC_SEASON_CATEGORY: 'season',
     SYNC_SEASON_START: 'seasonstart',
     SYNC_CALENDAR_ACCESSROLE: 'owner',
     PUBLIC_DIR: '/public/app',
     SITE_INDEX: '/index-local.html',
     MAX_AGE_GENERAL: 0,
     MAX_AGE_ASSETS: 0

   },
   prod: {
     googlesetup: {
       auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
       auth_uri: "https://accounts.google.com/o/oauth2/auth",
       client_email: "",
       client_id: "119283461111-u9f8f4jgkacvocdsbdnv5u1gh73ubgku.apps.googleusercontent.com",
       client_secret: "H9oDB_HecYd7oE28IGeOUe_v",
       client_x509_cert_url: "",
       redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "oob"],
       token_uri: "https://accounts.google.com/o/oauth2/token"
     },
     googletokens: {
       token_type: "Bearer",
       refresh_token: "1/F1cIzWX9ajNlUYMSMVMQ7RkmRkC3p5ejWtf7zZ6Gznw",
       expiry_date: 1415075847934
     },
     auth0: {
       secret: "YuTlfYWW1PXw_AQt1-EvAWvUrUpwheCjkbF6GbI_1Op5Ml5FYiVEtzLd--OeP38k",
       audience: "zNhY5wesWo8iVMsdRYbM6VVXzeMjts0x"
     }, //TODO: Remove from the config and load using an ENV variable
     s3: {
       folder : "/images",
       bucket: "upsalsa",
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
       region : 'us-east-1'
     },
     CALENDAR_ID: "upsalsa@gmail.com",
     SIMULATED_NOW: false,
     EVENTS_MAXRESULTS: 20,
     EVENT_SEARCH_TIMEMAX: 7 * 24 * 60 * 60 * 1000,
     LOCATIONS_MAXRESULTS: 50,
     prerenderToken: "jJ9tuSryPgzvzFEytcA2",
     MONGO_CONNECTION: process.env.MONGO_CONNECTION,
     UPDATE_MIN_SUBSTRACTION: 30 * 24 * 60 * 60 * 1000,
     MAX_REPETITIVE_EVENT: 20,
     SYNC_SEASON_START_SEQ: 2,
     SYNC_SEASON_CATEGORY: 'season',
     SYNC_SEASON_START: 'seasonstart',
     SYNC_CALENDAR_ACCESSROLE: 'owner',
     PUBLIC_DIR: '/public/app',
     SITE_INDEX: '/index.html',
     MAX_AGE_GENERAL: 24 * 60 * 60 * 1000,
     MAX_AGE_ASSETS: 365 * 24 * 60 * 60 * 1000
   }



 };
