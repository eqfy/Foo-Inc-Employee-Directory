name: Upload Website

on:
  push:
    branches:
    - mohsin

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@mohsin
    - uses: jakejarvis/s3-sync-action@master
      with:
        args: --acl public-read --follow-symlinks --delete
      env:
        AWS_S3_BUCKET: ${{ secrets.MOHSIN_BUCKET }}
        AWS_ACCESS_KEY_ID: ${{ secrets.MOHSIN_ACCESS_KEY }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.MOHSIN_SECRET_ACCESSKEY }}
        AWS_REGION: 'us-west-2'   # optional: default to us-east-1
        SOURCE_DIR: 'Frontend/build'      # optional: defaults to entire repository