import asyncHandler from "../utils/asynHandler.js";
import ApiError from "../utils/ApiError.js";
import { Project } from "../models/projects.modle.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Title is required");
  }

  if (!description || description.trim() === "") {
    throw new ApiError(400, "Description is required");
  }

  const project = await Project.create({
    title,
    description,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponce(201, project, "Project created successfully"));
});

const getProjects = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) {
    throw new ApiError(400, "Page must be a positive number");
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }

  const skip = (page - 1) * limit;

  const userFilter = {
    user: req.user._id,
  };

  const [projects, totalProjects] = await Promise.all([
    Project.find(userFilter)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .skip(skip)
      .limit(limit),

    Project.countDocuments(userFilter),
  ]);

  const totalPages = Math.ceil(totalProjects / limit);

  return res.status(200).json(
    new ApiResponce(
      200,
      {
        projects,

        pagination: {
          currentPage: page,
          limit,
          totalProjects,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      "Projects fetched successfully",
    ),
  );
});

export { createProject, getProjects };
