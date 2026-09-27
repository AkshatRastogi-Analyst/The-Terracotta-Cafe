import { Router } from "express";
import { z } from "zod";
import { db, reservationsTable } from "@workspace/db";
import { createTransport } from "nodemailer";

const router = Router();

const reservationSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(10).max(30),
  date: z.string().trim().min(1).max(20),
  time: z.string().trim().min(1).max(20),
  guests: z.number().int().min(1).max(20),
  notes: z.string().trim().max(1000).optional(),
});

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "akshat2592002@gmail.com",
    pass: process.env.EMAIL_PASS ?? "",
  },
});

router.post("/reservations", async (request, response) => {
  const parsed = reservationSchema.safeParse(request.body);
  if (!parsed.success) {
    response
      .status(400)
      .json({
        message: "Please complete the reservation details and try again.",
      });
    return;
  }

  try {
    const [reservation] = await db
      .insert(reservationsTable)
      .values(parsed.data)
      .returning({ id: reservationsTable.id });
    if (process.env.ENABLE_EMAILS === "true") {
      try {
        await transporter.sendMail({
          from: "akshat2592002@gmail.com",
          to: "akshat2592002@gmail.com",
          subject: `New Reservation - ${parsed.data.date}`,
          text: [
            `Customer: ${parsed.data.fullName}`,
            `Phone: ${parsed.data.phone}`,
            `Date: ${parsed.data.date}`,
            `Time: ${parsed.data.time}`,
            `Guests: ${parsed.data.guests}`,
            `Notes: ${parsed.data.notes || "None"}`,
          ].join("\n"),
        });
      } catch (error) {
        request.log.error(
          { err: error, reservationId: reservation.id },
          "Reservation saved but notification email failed",
        );
      }
    }

    response.status(201).json({ success: true, reservationId: reservation.id });
    response.status(201).json({ success: true, reservationId: reservation.id });
  } catch (error) {
    request.log.error({ err: error }, "Unable to save reservation");
    response
      .status(500)
      .json({
        message: "We could not save your reservation. Please try again.",
      });
  }
});

export default router;
