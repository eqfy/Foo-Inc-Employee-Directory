# Foo Inc. Associated Engineering Project
Visit http://frontendstack-webbsitebucket1311e45d-w6c9hl72i9qs.s3-website-us-west-2.amazonaws.com/search

## General Environment Information

Our application is hosted entirely on aws, we have three release environments which are all on aws as well:

### Development Environment: 

This environment is where the bulk of the application development happens. It is characterized by developers locally running a frontend node server while being connected to the app’s development environment backend hosted on AWS. Only software developers seeking to modify the application code will ever interact with this environment. By default there are 1000 mock-data workers in the database.

### Testing Environment: 

In this environment, automated E2E tests and most manual testing are done, to find, review and fix bugs for the application. CI code runners (Github Actions), developers and testers can all work in this environment. The database is initialized to have a 1000 mock-data workers here. Our Work In Progress link is also in this environment.

### Production Environment: 

This is the environment that will be used by sponsors in production. This environment will have by default a database with no workers, so that the actual list of workers can be inserted in by the sponsors. This environment will only be updated when new functionality or bug fixes have been completed and tested in the development and testing environment. (This environment can be migrated from aws to a windows server, details provided in the Migration section below)

## Project Setup

**Prerequisites** — Outlined below are the software and versions used by Foo Inc. in developing this application with version numbers available for reference and debugging purposes. Instructions on setting up this software will be outlined in detail below

**Backend**
+ C# (v8.0)
+ .NET (v3.1)
+ EF Core (v3.1) (ORM)
+ AWS services:
  + Lambda (API implementation)
  + RDS (PostgreSQL 12 database)
  + API Gateway (API endpoint)
  + Cognito (Admin authentication)
  + S3 buckets (Images and webpage)

**Frontend:** (all dependencies managed by yarn)
+ JavaScript (ES6)
+ React Framework (v17.0.1)
+ Redux (state management) (v4.0.5)
+ Material UI (v4.11.3)
+ Node (v14.15.4)

**Build/Deployment:**
+ Yarn (v1.21.1) to build frontend
+ CDK (v1.94.1) (to build lambdas, deploy infrastructure, and frontend static files to S3) 

**Testing:**
+ Cypress (v6.8.0)

**Development Prerequisites**
+ Github (source control)
+ Visual Studio Code (IDE)
+ Postman (API testing)

## Setup Tools & Configuration

### Install Tools
Install dotnet if you don’t have it already from https://dotnet.microsoft.com/download/dotnet/3.1

Follow these instructions from AWS to download the AWS Command Line Interface: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
Install npm if you don’t have it from https://nodejs.org/en/. Use version 14.15.4
Install AWS CloudDevelopmentKit by running `npm install -g aws-cdk`

Install yarn by running `npm install --global yarn`

Download git bash from https://gitforwindows.org/ and select all default options except the terminal emulator which you should select the windows version
Run ./update.sh in /src/Project — This must be run in the git Bash shell. 
In the root of the project run dotnet tool install -g Amazon.Lambda.Tools — This must be run in the git Bash shell. 



**AWS Setup**
Create an AWS account
Setup AWS CDK by following the Prerequisite section from https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html. You will be prompted for an AWS access key ID and a secret access key. You can find both of these here: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys
Just use enter these when promoted for:

Default region name [None]:us-west-2

Default output format [None]:

Run `cdk bootstrap aws://your-account/your-region` in the root folder of the project


## Deployment
Now that the project setup is complete you can deploy.

The root of the project contains a shell script which takes in a `-e` flag that sets the deployment environment and `-c` flag which will drop all tables in the database and initialize the database, this flag should be used if deploying from scratch. Once the database initialization script is run, the development and test environment will define a database schema and will populate the database. Contrarily, the production environment will define a database schema and will have an unpopulated database.

**Important to Note:**
The backend organization chart API contains logic dependent on the CEO’s employee number (it’s currently expecting it to be 10001; this constant variable named CeoID can be updated to a new value in Function.cs if required). This allows for the rendering of the CEO’s unique organization chart. Please keep this in mind when populating the production environment database with new data.

**Environments:**
Development environment: Run  `./deploy.sh -e dev` — This must be run in the git Bash shell.
+ **recommended** when running for the first time
Test environment: Run `./deploy.sh -e test` — This must be run in the git Bash shell.

Production environment: Run `./deploy.sh -e prod` — This must be run in the git Bash shell.

If you want to initialize or re-initialize the database (i.e. drop all tables and initialize) on deployment, add the `-c` flag by running deploy like so: `deploy.sh -e ${environment} -c`

**Creating Administrator Credentials**
Some functionality of this application requires administrator access. Run the following script to make an administrator account and obtain user credentials for use with the application.

Run `./createAdmin.sh` with a username and password to create a cognito user(If doesn’t work check if you are using the right AWS profile) (Example: `./createAdmin.sh Admin Admin.123`)

If you are running into requirements issues and you just want to authenticate with an existing administrator, use the following credentials:
+ Username: Admin
+ Password: Admin.123

### Opening Website
Steps to find the website link
1. Open the amazon console AWS Management Console (amazon.com)
2. In the top search bar search for S3, go to the S3 Management Console S3 Management Console (amazon.com)
3. Select the frontendstack-webbsitebucket 
4. Select properties
5. Scroll to the bottom and click on the Bucket website endpoint in the Static website hosting

### Destroying
In order to take down the AWS services if you are no longer using them you can run
cdk destroy ProjectStack and cdk destroy FrontendStack from the git bash terminal in the root folder of the project.

## Continuous Integration for Testing

### Setting up
Same for every environment:
1. Create a dedicated AWS account for each environment
2. Create an IAM user in each account with appropriate IAM role permissions (the `CI deploy will fail if you use the root user)
3. Copy IAM user’s access key ID and secret access key to GitHub’s secrets
4. Configure the GitHub Actions workflows (in .github/workflows) to trigger for different environments as desired (e.g., trigger workflow for the test environment on pull request, trigger for prod environment on push to main)

### How to run CI/Tests
Creating a pull request or pushing to a branch with a pull request will trigger the test workflow

Workflow statuses can be viewed and manually re-run in GitHub under the Actions tab. To trigger a re-run, click on the workflow and click “Re-run jobs” → “Re-run all jobs”

Triggers can be changed by configuring the workflows. See GitHub’s documentation for more details: https://docs.github.com/en/actions/reference/events-that-trigger-workflows

