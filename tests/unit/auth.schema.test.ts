import { registerSchema, loginSchema, sendOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "../../src/validation/auth.schema";

describe("Auth Schema Validation", () => {
  describe("registerSchema", () => {
    test("should validate a correct registration input", () => {
      const validInput = {
        email: "yogesh@gmail.com",
        phone: "+919876543210",
        password: "strongpassword",
        firstName: "Yogesh",
        lastName: "Sharma",
      };

      const result = registerSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      //   expect(validInput.email).toBe("yogesh@gmail.com");
      //   expect(validInput.phone).toBe("+919876543210");
      //   expect(validInput.password).toBe("strongpassword");
      //   expect(validInput.firstName).toBe("Yogesh");
      //   expect(validInput.lastName).toBe("Sharma");
    });

    test("should invalidate incorrect registration input", () => {
      const invalidInput = {
        email: "invalid-email",
        phone: "12345",
        password: "123",
        firstName: "A",
        lastName: "B",
      };
      const result = registerSchema.safeParse(invalidInput);

      console.log(result, "yogesh");

      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    test("should validate a correct login input", () => {
      const validInput = {
        email: "yogesh@gmail.com",
        phone: "+919876543210",
        password: "strongpassword",
      };
      const result = loginSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    test("should invalidate incorrect login input", () => {
      const invalidInput = {
        email: "invalid-email",
        phone: "12345",
        password: "123",
      };
      const result = loginSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });
  });

  describe("sendOtpSchema", () => {
    test("should validate a correct phone number for OTP", () => {
      const validInput = {
        phone: "+919876543210",
      };
      const result = sendOtpSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    })
    test("should invalidate incorrect phone number for OTP", () => {
      const invalidInput = {
        phone: "12345",
      };
      const result = sendOtpSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });
});

  describe("forgotPasswordSchema", () => {
    test("should validate when email is provided", () => {
      const validInput = {
        email: "yogesh@gmail.com",
        phone: "+919876543210",
      };
      const result = forgotPasswordSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    })

    test("should validate when phone is provided", () => {
      const validInput = {
        phone: "+919876543210",
      };
      const result = forgotPasswordSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    })

    test("should invalidate when neither email nor phone is provided", () => {
      const invalidInput = {
        email: "",
        phone: "",
      };
      const result = forgotPasswordSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
})

  describe("resetPasswordSchema", () => {
    test("should accept valid reset token and password", () => {
      const data = { resetToken: "valid_token_123", newPassword: "NewPass123" };
      expect(resetPasswordSchema.safeParse(data).success).toBe(true);
    });

    test("should reject password shorter than 6 characters", () => {
      const data = { resetToken: "valid_token", newPassword: "Pass" };
      const result = resetPasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    test("should reject missing reset token", () => {
      const data = { newPassword: "Pass123" };
      const result = resetPasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
