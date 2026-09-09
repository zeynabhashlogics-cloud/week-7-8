import express from "express";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, status, priority } = req.query;

   const where =
   {
    userId:req.user.id,
   };
  if (search)
  {
    where.title ={
      contains: String(search),
      mode: "insensitive",
    };
  }
   if (status)
  {
  where.status = String(status);
  }
 if (priority)
  {
  where.priority = String(priority);
  }
 const tasks = await prisma.tasks.findMany({
  where,
  orderBy:{
    id: "asc",
  },
  });
  res.json(tasks);
}
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks.",
    });
  }
});


router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title,description,status,priority,dueDate,} = req.body;

    if (!title || !status || !priority) {
      return res.status(400).json({
        message: "Title, status, and priority are required",
      });
    }

    const statuses = ["pending", "completed"];
    const priorities = ["low", "medium", "high"];

    if (!statuses.includes(status.trim())) {
      return res.status(400).json({
        message: "Status must be pending or completed",
      });
    }

    if (!priorities.includes(priority.trim())) {
      return res.status(400).json({
        message: "Priority must be low, medium, or high",
      });
    }

    const task = await prisma.tasks.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status.trim(),
        priority: priority.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });

    res.status(201).json(task);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const { title, description,status,priority,dueDate,} = req.body;

    const task = await prisma.tasks.findUnique({
      where: {
        id,
      },
    });

    
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const statuses = ["pending", "completed"];
    const priorities = ["low", "medium", "high"];

    if (
      status !== undefined &&
      !statuses.includes(status.trim())
    ) {
      return res.status(400).json({
        message: "Status must be pending or completed",
      });
    }

    if ( priority !== undefined &&
      !priorities.includes(priority.trim())
    ) {
      return res.status(400).json({
        message: "Priority must be low, medium, or high",
      });
    }

    const updated = await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && {
          title: title.trim(),
        }),

        ...(description !== undefined && {
          description: description.trim() || null,
        }),

        ...(status !== undefined && {
          status: status.trim(),
        }),

        ...(priority !== undefined && {
          priority: priority.trim(),
        }),

        ...(dueDate !== undefined && {
          dueDate: dueDate
            ? new Date(dueDate)
            : null,
        }),
      },
    });

    res.status(200).json(updated);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await prisma.tasks.findUnique({
      where: {
        id,
      },
    });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.tasks.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;