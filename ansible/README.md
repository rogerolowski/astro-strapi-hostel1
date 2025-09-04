# Ansible Deployment for Hostel Management System

This directory contains Ansible playbooks and configurations for deploying the Hostel Management System to Contabo servers.

## Structure

```
ansible/
├── README.md                 # This file
├── ansible.cfg              # Ansible configuration
├── inventory/               # Inventory files
│   ├── production.yml       # Production server inventory
│   └── group_vars/          # Group variables
│       ├── all.yml          # Variables for all hosts
│       └── production.yml   # Production-specific variables
├── playbooks/              # Main playbooks
│   ├── deploy.yml          # Main deployment playbook
│   ├── setup.yml           # Initial server setup
│   └── update.yml          # Update existing deployment
├── roles/                  # Custom Ansible roles
│   ├── docker/             # Docker installation and configuration
│   ├── hostel-app/         # Application deployment
│   ├── security/           # Security hardening
│   └── monitoring/         # Monitoring setup
├── files/                  # Static files to copy
└── templates/              # Jinja2 templates
```

## Quick Start

1. **Configure inventory**: Update `inventory/production.yml` with your Contabo server details
2. **Set variables**: Update variables in `inventory/group_vars/`
3. **Initial setup**: Run the setup playbook for new servers
4. **Deploy**: Run the deployment playbook

## Usage Examples

```bash
# Initial server setup (run once)
ansible-playbook -i inventory/production.yml playbooks/setup.yml

# Deploy application
ansible-playbook -i inventory/production.yml playbooks/deploy.yml

# Update existing deployment
ansible-playbook -i inventory/production.yml playbooks/update.yml

# Deploy with specific tags
ansible-playbook -i inventory/production.yml playbooks/deploy.yml --tags "app,nginx"
```
