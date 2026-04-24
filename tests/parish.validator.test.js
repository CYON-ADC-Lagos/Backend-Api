require("./setup");

const {
  createParishSchema,
  updateParishSchema,
} = require("../src/validators/parish.validator");

describe("parish validator email normalization", () => {
  test("create schema converts blank email to null", () => {
    const { error, value } = createParishSchema.validate(
      {
        name: "St. Peter Parish",
        email: "",
        deaneryId: "550e8400-e29b-41d4-a716-446655440000",
      },
      { convert: true, stripUnknown: true }
    );

    expect(error).toBeUndefined();
    expect(value.email).toBeNull();
  });

  test("update schema converts blank email to null", () => {
    const { error, value } = updateParishSchema.validate(
      { email: "" },
      { convert: true, stripUnknown: true }
    );

    expect(error).toBeUndefined();
    expect(value.email).toBeNull();
  });

  test("create schema converts whitespace-only email to null", () => {
    const { error, value } = createParishSchema.validate(
      {
        name: "St. Jude Parish",
        email: "   ",
        deaneryId: "550e8400-e29b-41d4-a716-446655440000",
      },
      { convert: true, stripUnknown: true }
    );

    expect(error).toBeUndefined();
    expect(value.email).toBeNull();
  });

  test("create schema keeps omitted email unset", () => {
    const { error, value } = createParishSchema.validate(
      {
        name: "St. Paul Parish",
        deaneryId: "550e8400-e29b-41d4-a716-446655440000",
      },
      { convert: true, stripUnknown: true }
    );

    expect(error).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(value, "email")).toBe(false);
  });
});
