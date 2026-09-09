const common = `
  --require-module ts-node/register/transpile-only
    
    --require steps/**/*.steps.ts
    --require src/**/*.ts
    --require src/**/*.env
    --require src/utils/**/.ts
    --require lib/**/*.ts
    --format json:./test_results_BDD/cucumber.json'
    
    --publish-quiet true
    --format html:./test_results_BDD/Batch_cumber-report.html 
    --format-options ${JSON.stringify({ snippetInterface: 'async-await' })}
    --format node_modules/cucumber-pretty
   --format progress-bar
  --format summary
  `;




module.exports = {
  default: `${common} features/**/*.feature`
};