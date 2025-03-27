/**
 * Font Consistency Script
 * 
 * This script shows how to search for elements with font-related styles
 * and apply the force-montserrat class to enforce font consistency.
 * 
 * Run with: node scripts/apply-font.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directories to scan
const DIRS_TO_SCAN = [
  path.join(__dirname, '../components'),
  path.join(__dirname, '../app')
];

// Extensions to process
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Regular expressions for finding elements with style attributes
const ELEMENT_REGEX = /<([a-z][a-z0-9]*)([^>]*)>/gi;
const CLASS_NAME_REGEX = /className\s*=\s*{?["']([^"'}]*?)["']}?/i;

/**
 * Gets all files recursively from a directory
 */
async function getFilesRecursively(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFilesRecursively(res) : res;
  }));
  return Array.prototype.concat(...files)
    .filter(file => EXTENSIONS.includes(path.extname(file)));
}

/**
 * Modifies a file to add the force-montserrat class to elements
 */
async function processFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Example of how to modify class names in components
    // This is a simplified example - a real implementation would need more robust parsing
    content = content.replace(ELEMENT_REGEX, (match, tagName, attrs) => {
      // Only process if there's a className attribute
      if (CLASS_NAME_REGEX.test(attrs)) {
        modified = true;
        return match.replace(CLASS_NAME_REGEX, (classMatch, classNames) => {
          // Only add force-montserrat if it's not already present
          if (!classNames.includes('force-montserrat')) {
            return classMatch.replace(classNames, `${classNames} force-montserrat`);
          }
          return classMatch;
        });
      }
      return match;
    });
    
    if (modified) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Scanning for components...');
  
  for (const dir of DIRS_TO_SCAN) {
    try {
      const files = await getFilesRecursively(dir);
      console.log(`Found ${files.length} files in ${dir}`);
      
      for (const file of files) {
        await processFile(file);
      }
    } catch (err) {
      console.error(`Error scanning directory ${dir}:`, err);
    }
  }
  
  console.log('Done!');
}

// Uncomment to run the script automatically
// main();

console.log(`
IMPORTANT: This is a helper script that demonstrates how to apply the force-montserrat class.
Review and test it before running on your actual codebase.

To apply the font consistently without this script:

1. Use the 'force-montserrat' class on parent components
2. Add className="force-montserrat" to components with custom styles
3. Use the CSS variables in any custom styled-components

Example:
<div className="force-montserrat">
  {/* All child components will inherit Montserrat */}
</div>
`); 