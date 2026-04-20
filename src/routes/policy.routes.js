const express = require("express");
const router = express.Router();

const policyController = require("../controllers/policy.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createPolicySchema,
  updatePolicySchema,
} = require("../validators/cms.validator");

router.get("/", policyController.getPolicies);
router.get("/:slug", policyController.getPolicyBySlug);
router.post(
  "/",
  protect,
  authorize("Admin"),
  validate(createPolicySchema),
  policyController.createPolicy
);
router.put(
  "/:id",
  protect,
  authorize("Admin"),
  validate(updatePolicySchema),
  policyController.updatePolicy
);
router.delete("/:id", protect, authorize("Admin"), policyController.deletePolicy);

module.exports = router;
