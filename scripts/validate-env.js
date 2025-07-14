const requiredVars = [
  'NOTION_TOKEN',
  'NOTION_DATABASE_SERVICES',
  'NOTION_DATABASE_BLOG_POSTS',
  'DEEPSEEK_API_KEY',
  'RESEND_API_KEY'
];

const optionalVars = [
  'NOTION_DATABASE_SUBSCRIBERS',
  'NOTION_DATABASE_NEWSLETTERS',
  'PEXELS_API_KEY',
  'BRAVE_API_KEY',
  'GEMINI_API_KEY'
];

console.log('🔍 Validating environment variables...');
console.log('═══════════════════════════════════════');

const missing = requiredVars.filter(varName => !process.env[varName]);
const present = requiredVars.filter(varName => process.env[varName]);

// Check required variables
console.log('📋 Required Variables:');
present.forEach(varName => {
  const value = process.env[varName];
  const maskedValue = value ? `${value.substring(0, 4)}***${value.substring(value.length - 4)}` : '';
  console.log(`   ✅ ${varName}: ${maskedValue}`);
});

if (missing.length > 0) {
  console.log('\n❌ Missing required environment variables:');
  missing.forEach(varName => console.log(`   ❌ ${varName}`));
}

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const maskedValue = `${value.substring(0, 4)}***${value.substring(value.length - 4)}`;
    console.log(`   ✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`   ⚪ ${varName}: not set`);
  }
});

// Validate Notion database ID format
console.log('\n🔍 Validating Notion Database IDs:');
const databaseVars = [
  'NOTION_DATABASE_SERVICES',
  'NOTION_DATABASE_BLOG_POSTS',
  'NOTION_DATABASE_SUBSCRIBERS',
  'NOTION_DATABASE_NEWSLETTERS'
];

const isValidDatabaseId = (id) => {
  if (!id) return false;
  // Remove hyphens and check if it's 32 characters of hex
  const cleanId = id.replace(/-/g, '');
  return /^[a-f0-9]{32}$/i.test(cleanId);
};

databaseVars.forEach(varName => {
  const id = process.env[varName];
  if (id) {
    const isValid = isValidDatabaseId(id);
    const status = isValid ? '✅' : '❌';
    console.log(`   ${status} ${varName}: ${isValid ? 'valid format' : 'invalid format'}`);
  }
});

console.log('═══════════════════════════════════════');

if (missing.length > 0) {
  console.log('\n❌ Validation failed! Please check your .env file or deployment settings.');
  console.log('\n💡 Make sure all required environment variables are set before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  console.log('🚀 Environment is ready for deployment.');
}