// Eventsbridge-Web/frontend/src/components/customer/ServiceDetails/WhyChooseUs.jsx

import { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaUndo } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../../utils/constant.js";

const WhyChooseUs = ({ 
  serviceId, 
  vendorId, 
  whyChooseUsPoints = [], 
  isOwner = false,
  onUpdate = null 
}) => {
  const [points, setPoints] = useState(whyChooseUsPoints);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePoints, setEditablePoints] = useState([]);
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    setPoints(whyChooseUsPoints);
  }, [whyChooseUsPoints]);

  useEffect(() => {
    setCanEdit(isOwner);
    console.log("WhyChooseUs received isOwner prop:", isOwner);
  }, [isOwner]);

  const handleEditClick = async () => {
    if (!canEdit) {
      toast.error("You can only edit your own services");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/vendors/service/${serviceId}/why-choose-us`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const { whyChooseUs, isCustom: customStatus } = response.data.data;
        setEditablePoints([...whyChooseUs]);
        setIsCustom(customStatus);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching Why Choose Us points:", error);
      toast.error("Failed to load current points");
      setEditablePoints([...points]);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (editablePoints.length === 0) {
      toast.error("Please add at least one point");
      return;
    }

    if (editablePoints.length > 5) {
      toast.error("Maximum 5 points allowed");
      return;
    }

    const validPoints = editablePoints.filter(point => 
      typeof point === 'string' && point.trim().length > 0
    );

    if (validPoints.length === 0) {
      toast.error("Please add valid points");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/vendors/service/${serviceId}/why-choose-us`,
        { whyChooseUs: validPoints },
        { withCredentials: true }
      );

      if (response.data.success) {
        setPoints(validPoints);
        setIsCustom(true);
        setIsEditing(false);
        toast.success("Why Choose Us points updated successfully!");
        
        if (onUpdate) {
          onUpdate(validPoints);
        }
      }
    } catch (error) {
      console.error("Error updating Why Choose Us points:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update points");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditablePoints([]);
    setIsEditing(false);
  };

  const handlePointChange = (index, value) => {
    const updatedPoints = [...editablePoints];
    updatedPoints[index] = value;
    setEditablePoints(updatedPoints);
  };

  const handleAddPoint = () => {
    if (editablePoints.length >= 5) {
      toast.error("Maximum 5 points allowed");
      return;
    }
    setEditablePoints([...editablePoints, ""]);
  };

  const handleRemovePoint = (index) => {
    if (editablePoints.length <= 1) {
      toast.error("At least one point is required");
      return;
    }
    const updatedPoints = editablePoints.filter((_, i) => i !== index);
    setEditablePoints(updatedPoints);
  };

  const handleResetToDefault = async () => {
    if (window.confirm("Reset to category defaults? Your custom points will be lost.")) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${BACKEND_URL}/vendors/service/${serviceId}/why-choose-us`,
          { withCredentials: true }
        );

        if (response.data.success) {
          const { whyChooseUs } = response.data.data;
          setPoints(whyChooseUs);
          setIsCustom(false);
          setIsEditing(false);
          toast.success("Reset to category defaults successfully!");
          
          if (onUpdate) {
            onUpdate(whyChooseUs);
          }
        }
      } catch (error) {
        console.error("Error resetting Why Choose Us points:", error);
        toast.error("Failed to reset to defaults");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <div className="why-choose">
      <div className="flex items-center justify-between mb-3">
        <h2>Why Choose Us?</h2>
        
        {canEdit && !isEditing && (
          <div className="flex items-center gap-2">
            {isCustom && (
              <button
                onClick={handleResetToDefault}
                disabled={loading}
                className="text-sm px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors duration-200 flex items-center gap-1"
                title="Reset to category defaults"
              >
                <FaUndo size={12} />
                Reset
              </button>
            )}
            <button
              onClick={handleEditClick}
              disabled={loading}
              className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200 flex items-center gap-1"
            >
              <FaEdit size={12} />
              Edit
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {editablePoints.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                placeholder={`Point ${index + 1}`}
                maxLength={100}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleRemovePoint(index)}
                disabled={editablePoints.length <= 1}
                className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                title="Remove point"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}

          {editablePoints.length < 5 && (
            <button
              onClick={handleAddPoint}
              className="w-full py-2 border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-500 hover:text-blue-500 rounded transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FaPlus size={12} />
              Add Point (Max 5)
            </button>
          )}

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors duration-200 flex items-center gap-2"
            >
              <FaTimes size={12} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || editablePoints.filter(p => p.trim()).length === 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors duration-200 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaSave size={12} />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            {isCustom ? (
              <span className="text-blue-600">✓ Using custom points</span>
            ) : (
              <span>Using category defaults</span>
            )}
          </div>
        </div>
      ) : (
        <ul>
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}

      {canEdit && !isEditing && isCustom && (
        <div className="text-xs text-blue-600 mt-2">
          ✓ Custom points active
        </div>
      )}
    </div>
  );
};

export default WhyChooseUs;