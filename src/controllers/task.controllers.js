import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asynHandler.js";
import { Task } from "../models/task.modle.js";
import { Project } from "../models/projects.modle.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, isCompleted = false, projectId } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Title is required");
  }

  if (typeof isCompleted !== "boolean") {
    throw new ApiError(400, "isCompleted must be a boolean");
  }

  if (!projectId) {
    throw new ApiError(400, "Project is required");
  }

  const existingProject = await Project.findOne({
    _id: projectId,
    user: req.user._id,
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.create({
    title: title.trim(),
    isCompleted,
    user: req.user._id,
    project: projectId,
  });

  return res
    .status(201)
    .json(new ApiResponce(201, task, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, projectId } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) {
    throw new ApiError(400, "Page must be a positive number");
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }

  const userFilter = {
    user: req.user._id,
  };

  if (projectId) {
    const existingProject = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!existingProject) {
      throw new ApiError(404, "Project not found");
    }

    userFilter.project = projectId;
  }

  const skip = (page - 1) * limit;

  const [tasks, totalTasks, completedTasks] = await Promise.all([
    Task.find(userFilter)
      .populate("project", "title description")
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .skip(skip)
      .limit(limit),

    Task.countDocuments(userFilter),

    Task.countDocuments({
      ...userFilter,
      isCompleted: true,
    }),
  ]);

  const remainingTasks = totalTasks - completedTasks;
  const totalPages = Math.ceil(totalTasks / limit);

  return res.status(200).json(
    new ApiResponce(
      200,
      {
        tasks,

        taskSummary: {
          totalTasks,
          completedTasks,
          remainingTasks,
        },

        pagination: {
          currentPage: page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      "Tasks fetched successfully",
    ),
  );
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
  }).populate("project", "title description");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, task, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, isCompleted } = req.body;

  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Title cannot be empty");
    }

    task.title = title.trim();
  }

  if (isCompleted !== undefined) {
    if (typeof isCompleted !== "boolean") {
      throw new ApiError(400, "isCompleted must be a boolean");
    }

    task.isCompleted = isCompleted;
  }

  await task.save();

  return res
    .status(200)
    .json(new ApiResponce(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, task, "Task deleted successfully"));
});

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
