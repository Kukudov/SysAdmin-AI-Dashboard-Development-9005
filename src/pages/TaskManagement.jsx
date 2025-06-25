import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiTrash2, FiUser, FiCalendar, FiFlag } = FiIcons;

const TaskManagement = () => {
  const { user, profile, isManager } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
    status: 'pending',
  });

  const columns = {
    pending: { title: 'Pending', color: 'bg-yellow-100 border-yellow-200' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-100 border-blue-200' },
    review: { title: 'Review', color: 'bg-purple-100 border-purple-200' },
    completed: { title: 'Completed', color: 'bg-green-100 border-green-200' },
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await dbHelpers.getTasks();
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await dbHelpers.getUsers();
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = draggableId;
    const newStatus = destination.droppableId;

    // Only managers can reassign tasks
    const task = tasks.find(t => t.id === taskId);
    if (!isManager && task.assigned_to !== user.id) {
      return;
    }

    try {
      const { error } = await dbHelpers.updateTask(taskId, { status: newStatus });
      if (error) throw error;

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        created_by: user.id,
        created_at: new Date().toISOString(),
      };

      if (editingTask) {
        const { error } = await dbHelpers.updateTask(editingTask.id, formData);
        if (error) throw error;
      } else {
        const { error } = await dbHelpers.createTask(taskData);
        if (error) throw error;
      }

      await fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assigned_to: '',
      due_date: '',
      priority: 'medium',
      status: 'pending',
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to || '',
      due_date: task.due_date || '',
      priority: task.priority || 'medium',
      status: task.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await dbHelpers.deleteTask(taskId);
      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const TaskCard = ({ task, index }) => {
    const assignedUser = users.find(u => u.id === task.assigned_to);
    const canEdit = isManager || task.assigned_to === user.id;

    return (
      <Draggable draggableId={task.id} index={index} isDragDisabled={!canEdit}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-700
              ${snapshot.isDragging ? 'shadow-lg' : ''}
              ${canEdit ? 'cursor-move' : 'cursor-default'}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {task.title}
              </h4>
              {canEdit && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <SafeIcon icon={FiEdit} className="w-3 h-3" />
                  </button>
                  {isManager && (
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {task.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {assignedUser && (
                  <div className="flex items-center">
                    <SafeIcon icon={FiUser} className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {assignedUser.full_name}
                    </span>
                  </div>
                )}
                <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                  <SafeIcon icon={FiFlag} className="w-3 h-3 mr-1" />
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>
              {task.due_date && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([status, column]) => (
            <div key={status} className="space-y-4">
              <div className={`rounded-lg border-2 border-dashed p-4 ${column.color}`}>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {column.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tasks.filter(task => task.status === status).length} tasks
                </p>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[200px] rounded-lg p-2
                      ${snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700' : 'bg-transparent'}
                    `}
                  >
                    {tasks
                      .filter(task => task.status === status)
                      .map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Assign To</label>
                      <select
                        className="form-input"
                        value={formData.assigned_to}
                        onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                      >
                        <option value="">Select User (Optional)</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.full_name} ({user.role})
                          </option>
                        ))}
                      </select>
                      {!isManager && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Only managers can assign tasks to other users
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Priority</label>
                        <select
                          className="form-input"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Due Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={formData.due_date}
                          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        />
                      </div>
                    </div>

                    {editingTask && (
                      <div>
                        <label className="form-label">Status</label>
                        <select
                          className="form-input"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn-primary sm:ml-3"
                  >
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;