terraform {
  required_providers {
    ibm = {
      version = ">= 1.12.0"
      source  = "IBM-Cloud/ibm"
    }
  }
}

# Configure the IBM Provider
provider "ibm" {
  region           = "us-south"
  ibmcloud_api_key = var.ibmcloud_api_key
}
# Configure the resource group
data "ibm_resource_group" "db_default" {
  is_default = true
}

# Create database 
resource "ibm_database" "postgresql_db" {
  resource_group_id = data.ibm_resource_group.db_default.id
  name              = "test-postgresql" 
  service           = "databases-for-postgresql"
  plan              = "standard"
  location          = "us-south"
  service_endpoints = "public"
  group {
    group_id = "member"
    host_flavor {
      id = "multitenant"
    }
    cpu {
      allocation_count = 0
    }
    memory {
      allocation_mb = 4096
    }
    disk {
      allocation_mb = 5120
    }
  }
}