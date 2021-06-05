# This is a basic workflow to help you get started with Actions

name: CI Hello-Python

# Controls when the action will run. 
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
- name: Synopsys Intelligent Security Scan
  # You may pin to the exact commit or the version.
  # uses: synopsys-sig/intelligent-security-scan@048c2309ca958639783d0eb316ec212310787636
  uses: synopsys-sig/intelligent-security-scan@2021.04
  with:
    # The server Host URL for Intelligent Scan Engine eg http://localhost:1111 or https://21b7.ngrok.io
    ioServerUrl: # default is http://localhost:9090
    # The server password for Intelligent Scan Engine
    ioServerToken: # optional, default is 
    # HTTP URL to download IO Manifest file synopsys-io.yml
    ioManifestUrl: # optional
    # The server Host URL for Intelligent Scan Workflow Engine eg http://localhost:1111 or https://21b7.ngrok.io
    workflowServerUrl: # default is http://localhost:9091
    # The workflow jar version to retrieve for Intelligent Scan Engine
    workflowVersion: # optional, default is 2021.04
    # Additional arguments required for workflow engine arguments
    additionalWorkflowArgs: 
    # Additional arguments required for workflow engine arguments
    stage: # default is IO
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
- name: Aqua Security Trivy
  # You may pin to the exact commit or the version.
  # uses: aquasecurity/trivy-action@2b5de510862c22b735aa586acbafe850cfe75148 >- name: cfn-security
  # You may pin to the exact commit or the version.
  # uses: grolston/cfn-security@4ea98071812f299bf7f446e3b63b452d19088a4e
  uses: grolston/cfn-security@v0.1.0
  uses: aquasecurity/trivy-action@0.0.8
  with:- name: Crashtest Security Action
  # You may pin to the exact commit or the version.
  # uses: crashtest-security/github-action@353aa9fbe44fe433cc6027164788d03abc5cae34
  uses: crashtest-security/github-action@v1.0.0
  with:
    # Webhook Secret of the Crashtest Security Scan Target
    crashtest-webhook: 
    # Flag whether the report should be downloaded as JUnit XML file
    pull-report: # optional, default is false
    # image reference
    image-ref: 
    # exit code when vulnerabilities were found
    exit-code: # optional, default is 0
    # ignore unfixed vulnerabilities
    ignore-unfixed: # optional
    # severities of vulnerabilities to be displayed
    severity: # optional, default is UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL
    # output format (table, json, template)
    format: # optional, default is table
    # use an existing template for rendering output (@/contrib/sarif.tpl, @/contrib/gitlab.tpl, @/contrib/junit.tpl
    template: # optional, default is 
    # writes results to a file with the specified file name
    output: # optional, default is 
      # Runs a single command using the runners shell
      - name: Run a one-line script
        run: echo Hello, world!
- name: SecurityCodeScan
  # You may pin to the exact commit or the version.
  # uses: security-code-scan/security-code-scan-results-action@cdb3d5e639054395e45bf401cba8688fcaf7a687
  uses: security-code-scan/security-code-scan-results-action@v1.3
  with:
    # The output directory where SARIF files should be collected.
    sarif_directory: # optional, default is ../results
      # Runs a set of commands using the runners shell
      - name: Run a multi-line script
        run: |
          echo Add other actions to build,
          echo test, and deploy your project.
- name: Security Badger
  # You may pin to the exact commit or the version.
  # uses: nicklemmon/security-badger@b470062eea5d633d17f669cc0e1abc83617c149f
  uses: nicklemmon/security-badger@v0.0.13-alpha
  with:
    # Slack Channel that will see posted Security Badger messages
    slackChannel: 
