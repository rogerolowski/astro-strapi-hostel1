console.log("Testing pg module...");
try {
  require("pg");
  console.log("SUCCESS: pg module found and loaded");
} catch(e) {
  console.log("ERROR:", e.message);
  console.log("Stack:", e.stack);
}
