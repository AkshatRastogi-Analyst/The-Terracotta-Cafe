import { Router } from "express";
import { z } from "zod";
import { db, ordersTable } from "@workspace/db";
import { createTransport } from "nodemailer";

const router = Router();

const orderSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(10).max(30),
  tableNumber: z.string().trim().min(1).max(30),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        quantity: z.number().int().min(1).max(50),
        price: z.number().int().min(0),
      }),
    )
    .min(1)
    .max(50),
  total: z.number().int().min(0),
});

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "akshat2592002@gmail.com",
    pass: process.env.EMAIL_PASS ?? "",
  },
});

router.post("/orders", async (request, response) => {
  const parsed = orderSchema.safeParse(request.body);
  if (!parsed.success) {
    response
      .status(400)
      .json({ message: "Please check the order details and try again." });
    return;
  }

  try {
    const [order] = await db
      .insert(ordersTable)
      .values(parsed.data)
      .returning({ id: ordersTable.id });
    const itemLines = parsed.data.items
      .map(
        (item) =>
          `${item.quantity} × ${item.name} — ₹${item.price * item.quantity}`,
      )
      .join("\n");

    try {
      if (process.env.ENABLE_EMAILS === "true") {
        await transporter.sendMail({
          from: "akshat2592002@gmail.com",
          to: "akshat2592002@gmail.com",
          subject: `New Dine-In Order - Table ${parsed.data.tableNumber}`,
          text: [
            `Customer: ${parsed.data.customerName}`,
            `Phone: ${parsed.data.phone}`,
            `Table: ${parsed.data.tableNumber}`,
            "",
            itemLines,
            "",
            `Total: ₹${parsed.data.total}`,
          ].join("\n"),
        });
      }
    } catch (error) {
      request.log.error(
        { err: error, orderId: order.id },
        "Order saved but notification email failed",
      );
    }

    response.status(201).json({ success: true, orderId: order.id });
  } catch (error) {
    request.log.error({ err: error }, "Unable to save dine-in order");
    response
      .status(500)
      .json({ message: "We could not save your order. Please try again." });
  }
});

export default router;
