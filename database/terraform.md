# Terraform Configuration for IBM Cloud Database

This directory contains Terraform configuration to provision a PostgreSQL database on IBM Cloud.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- IBM Cloud account
- IBM Cloud API Key

## Getting Your IBM Cloud API Key

1. Log in to [IBM Cloud Console](https://cloud.ibm.com/)
2. Navigate to **Manage** → **Access (IAM)** → **API keys**
3. Click **Create an IBM Cloud API key**
4. Give it a descriptive name (e.g., "Terraform Hackathon")
5. Copy the API key (you won't be able to see it again)

## Setup

1. **Copy the example variables file:**
   ```bash
   cd database
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars` and add your IBM Cloud API key:**
   ```hcl
   ibmcloud_api_key = "your-actual-api-key-here"
   ```

3. **Initialize Terraform:**
   ```bash
   terraform init
   ```

## Usage

### Plan Changes
Preview what Terraform will create:
```bash
terraform plan
```

### Apply Changes
Create the infrastructure:
```bash
terraform apply
```

### Destroy Infrastructure
Remove all created resources:
```bash
terraform destroy
```

## Configuration Files

- **`main.tf`** - Main Terraform configuration with provider and resources
- **`variables.tf`** - Variable definitions
- **`terraform.tfvars`** - Variable values (contains secrets, not in git)
- **`terraform.tfvars.example`** - Template for terraform.tfvars

## Security Notes

⚠️ **IMPORTANT**: The `terraform.tfvars` file contains sensitive credentials and is excluded from version control via `.gitignore`. Never commit this file to git.

## Resources Created

- **IBM Resource Group** (data source - uses default)
- **IBM Database for PostgreSQL**
  - Plan: Standard
  - Location: us-south
  - Memory: 4096 MB
  - Disk: 5120 MB
  - Service Endpoints: Public

## Troubleshooting

### Authentication Error
If you get authentication errors, verify:
1. Your API key is correct in `terraform.tfvars`
2. Your API key has the necessary permissions
3. You're using the correct IBM Cloud account

### Resource Already Exists
If a resource already exists with the same name:
1. Change the `name` parameter in `main.tf`
2. Or import the existing resource: `terraform import ibm_database.postgresql_db <resource-id>`

## Cost Estimation

The Standard plan PostgreSQL database costs approximately:
- **~$30-50 USD/month** for the base configuration (4GB RAM, 5GB disk)

Use `terraform plan` to see estimated costs before applying.

## Additional Resources

- [IBM Cloud Terraform Provider Documentation](https://registry.terraform.io/providers/IBM-Cloud/ibm/latest/docs)
- [IBM Cloud Database for PostgreSQL](https://cloud.ibm.com/docs/databases-for-postgresql)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)