#!/usr/bin/env node

/**
 * Seed script to create default templates in AetherOS
 * This creates a system user and basic templates for new users
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const defaultTemplates = [
  {
    name: 'Python Hello World',
    description: 'A simple Python script that prints "Hello, World!" - perfect for beginners',
    type: 'code',
    language: 'python',
    framework: 'Python',
    template_category: 'Starter Templates',
    content: `#!/usr/bin/env python3

def main():
    """
    Simple Hello World function
    """
    print("Hello, World!")
    print("Welcome to AetherOS!")
    
    # You can modify this code as needed
    name = input("What's your name? ")
    print(f"Hello, {name}! Nice to meet you.")

if __name__ == "__main__":
    main()
`,
    metadata: {
      tags: ['beginner', 'python', 'hello-world'],
      difficulty: 'beginner',
      estimated_time: '5 minutes'
    }
  },
  {
    name: 'JavaScript Function Template',
    description: 'A reusable JavaScript function template with error handling and documentation',
    type: 'code',
    language: 'javascript',
    framework: 'Node.js',
    template_category: 'Starter Templates',
    content: `/**
 * Template for creating reusable JavaScript functions
 * @param {any} input - The input parameter
 * @returns {any} - The processed result
 */
function templateFunction(input) {
    try {
        // Input validation
        if (!input) {
            throw new Error('Input parameter is required');
        }
        
        // Your logic here
        console.log('Processing input:', input);
        
        // Return result
        return {
            success: true,
            data: input,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error in templateFunction:', error.message);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Example usage
const result = templateFunction('Hello, AetherOS!');
console.log('Result:', result);

module.exports = { templateFunction };
`,
    metadata: {
      tags: ['javascript', 'function', 'template', 'error-handling'],
      difficulty: 'intermediate',
      estimated_time: '10 minutes'
    }
  },
  {
    name: 'REST API Endpoint',
    description: 'A basic REST API endpoint template with CRUD operations',
    type: 'api',
    language: 'javascript',
    framework: 'Express.js',
    template_category: 'API Templates',
    content: `const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let items = [];
let nextId = 1;

/**
 * GET /api/items - Get all items
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: items,
        count: items.length
    });
});

/**
 * GET /api/items/:id - Get item by ID
 */
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }
    
    res.json({
        success: true,
        data: item
    });
});

/**
 * POST /api/items - Create new item
 */
router.post('/', (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Name is required'
        });
    }
    
    const newItem = {
        id: nextId++,
        name,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    
    res.status(201).json({
        success: true,
        data: newItem,
        message: 'Item created successfully'
    });
});

/**
 * PUT /api/items/:id - Update item
 */
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }
    
    const { name, description } = req.body;
    
    items[itemIndex] = {
        ...items[itemIndex],
        name: name || items[itemIndex].name,
        description: description !== undefined ? description : items[itemIndex].description,
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        success: true,
        data: items[itemIndex],
        message: 'Item updated successfully'
    });
});

/**
 * DELETE /api/items/:id - Delete item
 */
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }
    
    items.splice(itemIndex, 1);
    
    res.json({
        success: true,
        message: 'Item deleted successfully'
    });
});

module.exports = router;
`,
    metadata: {
      tags: ['api', 'rest', 'express', 'crud'],
      difficulty: 'intermediate',
      estimated_time: '20 minutes'
    }
  },
  {
    name: 'React Component Template',
    description: 'A functional React component template with props, state, and basic styling',
    type: 'ui',
    language: 'javascript',
    framework: 'React',
    template_category: 'UI Templates',
    content: `import React, { useState, useEffect } from 'react';

/**
 * Template React Component
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onAction - Callback function for actions
 * @param {string} props.className - Additional CSS classes
 */
const TemplateComponent = ({ 
    title = 'Template Component', 
    onAction, 
    className = '' 
}) => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Component mount effect
        console.log('TemplateComponent mounted');
        
        // Cleanup function
        return () => {
            console.log('TemplateComponent unmounted');
        };
    }, []);

    const handleClick = async () => {
        setLoading(true);
        setCount(prev => prev + 1);
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (onAction) {
            onAction(count + 1);
        }
        
        setLoading(false);
    };

    return (
        <div className={\`template-component \${className}\`}>
            <h2 className="title">{title}</h2>
            
            <div className="content">
                <p>This is a template component created with AetherOS.</p>
                <p>Count: <strong>{count}</strong></p>
                
                <button 
                    onClick={handleClick}
                    disabled={loading}
                    className="action-button"
                >
                    {loading ? 'Processing...' : 'Click Me!'}
                </button>
            </div>

            <style jsx>{\`
                .template-component {
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background: #f9f9f9;
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .title {
                    color: #333;
                    text-align: center;
                    margin-bottom: 16px;
                }
                
                .content {
                    text-align: center;
                }
                
                .action-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 12px;
                    transition: background 0.2s;
                }
                
                .action-button:hover:not(:disabled) {
                    background: #0056b3;
                }
                
                .action-button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
                }
            \`}</style>
        </div>
    );
};

export default TemplateComponent;

// Example usage:
/*
<TemplateComponent 
    title="My Custom Component"
    onAction={(count) => console.log('Count updated:', count)}
    className="custom-style"
/>
*/
`,
    metadata: {
      tags: ['react', 'component', 'ui', 'template'],
      difficulty: 'intermediate',
      estimated_time: '15 minutes'
    }
  },
  {
    name: 'CLI Tool Template',
    description: 'A command-line interface tool template with argument parsing and help',
    type: 'cli',
    language: 'javascript',
    framework: 'Node.js',
    template_category: 'CLI Templates',
    executable: true,
    content: `#!/usr/bin/env node

/**
 * CLI Tool Template for AetherOS
 * A simple command-line tool with argument parsing and help
 */

const fs = require('fs');
const path = require('path');

class CLITool {
    constructor() {
        this.name = 'aether-cli-tool';
        this.version = '1.0.0';
        this.description = 'A template CLI tool created with AetherOS';
    }

    /**
     * Show help information
     */
    showHelp() {
        console.log(\`
\${this.name} v\${this.version}
\${this.description}

Usage: \${this.name} [command] [options]

Commands:
  hello [name]     Say hello to someone
  count [number]   Count from 1 to number
  file [path]      Read and display file contents
  help             Show this help message

Options:
  --version, -v    Show version number
  --help, -h       Show help

Examples:
  \${this.name} hello World
  \${this.name} count 5
  \${this.name} file ./package.json
        \`);
    }

    /**
     * Say hello command
     */
    hello(name = 'World') {
        console.log(\`Hello, \${name}! 👋\`);
        console.log('Welcome to AetherOS CLI tools!');
    }

    /**
     * Count command
     */
    count(max = 10) {
        const number = parseInt(max);
        if (isNaN(number) || number < 1) {
            console.error('Error: Please provide a valid positive number');
            return;
        }

        console.log(\`Counting from 1 to \${number}:\`);
        for (let i = 1; i <= number; i++) {
            console.log(\`\${i}\`);
        }
        console.log('Done! ✨');
    }

    /**
     * File reading command
     */
    readFile(filePath) {
        if (!filePath) {
            console.error('Error: Please provide a file path');
            return;
        }

        try {
            const fullPath = path.resolve(filePath);
            if (!fs.existsSync(fullPath)) {
                console.error(\`Error: File not found: \${filePath}\`);
                return;
            }

            const content = fs.readFileSync(fullPath, 'utf8');
            console.log(\`Contents of \${filePath}:\`);
            console.log('---');
            console.log(content);
            console.log('---');
        } catch (error) {
            console.error(\`Error reading file: \${error.message}\`);
        }
    }

    /**
     * Parse arguments and execute commands
     */
    run() {
        const args = process.argv.slice(2);
        
        if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
            this.showHelp();
            return;
        }

        if (args.includes('--version') || args.includes('-v')) {
            console.log(\`\${this.name} v\${this.version}\`);
            return;
        }

        const command = args[0];
        const params = args.slice(1);

        switch (command) {
            case 'hello':
                this.hello(params[0]);
                break;
            case 'count':
                this.count(params[0]);
                break;
            case 'file':
                this.readFile(params[0]);
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                console.error(\`Unknown command: \${command}\`);
                console.log('Run with --help for usage information');
                process.exit(1);
        }
    }
}

// Run the CLI tool
const cli = new CLITool();
cli.run();
`,
    metadata: {
      tags: ['cli', 'command-line', 'node', 'tool'],
      difficulty: 'intermediate',
      estimated_time: '25 minutes'
    }
  }
];

async function seedTemplates() {
  try {
    console.log('🌱 Seeding default templates...');

    // Create or get system user
    let systemUser;
    const systemUserResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['system@aetheros.local']
    );

    if (systemUserResult.rows.length === 0) {
      const newSystemUser = await pool.query(
        `INSERT INTO users (email, name, provider, provider_id, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
        ['system@aetheros.local', 'AetherOS System', 'system', 'system', true]
      );
      systemUser = newSystemUser.rows[0];
      console.log('✅ Created system user');
    } else {
      systemUser = systemUserResult.rows[0];
      console.log('✅ System user already exists');
    }

    // Check and create templates
    let createdCount = 0;
    let skippedCount = 0;

    for (const template of defaultTemplates) {
      // Check if template already exists
      const existingTemplate = await pool.query(
        'SELECT id FROM creations WHERE user_id = $1 AND name = $2 AND is_template = TRUE',
        [systemUser.id, template.name]
      );

      if (existingTemplate.rows.length > 0) {
        console.log(`⏭️  Skipped existing template: ${template.name}`);
        skippedCount++;
        continue;
      }

      // Create template
      await pool.query(
        `INSERT INTO creations (
          user_id, name, description, type, content, language, metadata, 
          framework, executable, version, is_current_version, is_template, 
          template_category, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, TRUE, TRUE, $10, NOW(), NOW())`,
        [
          systemUser.id,
          template.name,
          template.description,
          template.type,
          template.content,
          template.language,
          JSON.stringify(template.metadata),
          template.framework,
          template.executable || false,
          template.template_category
        ]
      );

      console.log(`✅ Created template: ${template.name}`);
      createdCount++;
    }

    console.log('\n🎉 Template seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   Created: ${createdCount} templates`);
    console.log(`   Skipped: ${skippedCount} templates`);
    console.log(`   Total: ${defaultTemplates.length} templates processed`);

  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedTemplates().catch(error => {
    console.error('Failed to seed templates:', error);
    process.exit(1);
  });
}

module.exports = { seedTemplates, defaultTemplates };