# Contributing to Hostel Management System

Thank you for considering contributing to our hostel management system! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+
- Yarn 4+
- Basic knowledge of Astro, Django, and Strapi

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/astro-strapi-hostel1.git
   cd astro-strapi-hostel1
   ```

2. **Start Development Environment**
   ```bash
   ./run.sh dev
   ```

3. **Verify Setup**
   - Frontend: http://localhost:4321
   - Backend API: http://localhost:8000
   - CMS Admin: http://localhost:3001/admin

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code style and patterns
   - Write clear, descriptive commit messages
   - Test your changes locally

3. **Test Your Changes**
   ```bash
   # Start development environment
   ./run.sh dev
   
   # Check logs for errors
   ./run.sh logs
   
   # Run specific service tests if available
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Convention

We follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: add user authentication to backend API`

## 🧪 Testing Guidelines

### Frontend (Astro)
```bash
cd frontend
yarn test  # If tests are available
yarn build # Verify build works
```

### Backend (Django)
```bash
# Inside backend container
docker-compose exec backend python manage.py test
```

### CMS (Strapi)
```bash
cd cms
yarn test  # If tests are available
yarn build # Verify admin panel builds
```

## 📝 Code Style Guidelines

### General Principles
- Write clean, readable code
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Add comments for complex logic

### Frontend (Astro/React)
- Use TypeScript where possible
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Keep components small and focused

### Backend (Django)
- Follow PEP 8 Python style guide
- Use Django best practices
- Write docstrings for functions and classes
- Use proper error handling

### CMS (Strapi)
- Follow Strapi conventions
- Use proper content type definitions
- Document API endpoints

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Operating System
   - Docker version
   - Node.js version
   - Browser (for frontend issues)

2. **Steps to Reproduce**
   - Clear step-by-step instructions
   - Expected vs actual behavior
   - Screenshots if relevant

3. **Error Messages**
   - Full error messages
   - Console logs
   - Docker logs if relevant

## ✨ Feature Requests

When suggesting features:

1. **Describe the Problem**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed Solution**
   - Detailed description of the feature
   - How should it work?
   - Any UI/UX considerations

3. **Alternatives Considered**
   - What other solutions did you consider?
   - Why is this the best approach?

## 📋 Pull Request Process

1. **Before Submitting**
   - Ensure your branch is up to date with main
   - Test your changes thoroughly
   - Update documentation if needed
   - Add or update tests if applicable

2. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Local development tested
   - [ ] All services start correctly
   - [ ] No console errors

   ## Screenshots (if applicable)
   Add screenshots for UI changes
   ```

3. **Review Process**
   - All PRs require review before merging
   - Address feedback promptly
   - Keep PRs focused and reasonably sized

## 🔧 Development Tips

### Docker Tips
```bash
# Rebuild a specific service
docker-compose build frontend

# View logs for a specific service
docker-compose logs -f backend

# Access a container shell
docker-compose exec backend bash
```

### Debugging
```bash
# Check service health
docker-compose ps

# Restart a specific service
docker-compose restart cms

# Clean start (remove volumes)
./run.sh clean
```

### Hot Reload
- Frontend and backend support hot reload in development
- CMS may require restart for some changes
- Database schema changes require rebuilding

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build/)
- [Django Documentation](https://docs.djangoproject.com/)
- [Strapi Documentation](https://docs.strapi.io/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Celebrate contributions from everyone

## 📞 Getting Help

If you need help:

1. Check existing issues and documentation
2. Ask questions in issue discussions
3. Provide detailed information about your problem
4. Be patient and respectful

Thank you for contributing! 🎉
