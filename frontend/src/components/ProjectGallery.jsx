import { useState, useEffect } from "react";
import {
  getProjectImages,
  createProjectImage,
  updateProjectImage,
  deleteProjectImage,
  reorderProjectImages,
  setProjectImageThumbnail,
} from "../services/projectService";

export default function ProjectGallery({ projectId, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  useEffect(() => {
    loadImages();
  }, [projectId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProjectImages(projectId);
      setImages(data.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();

    if (!newImageUrl.trim()) {
      setError("URL ảnh là bắt buộc");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createProjectImage({
        projectId,
        imageUrl: newImageUrl,
        caption: newImageCaption,
        order: images.length,
      });

      setNewImageUrl("");
      setNewImageCaption("");
      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImage = async (imageId, data) => {
    try {
      setLoading(true);
      setError("");
      await updateProjectImage(imageId, data);
      setEditingImage(null);
      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteProjectImage(imageId);
      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetThumbnail = async (imageId) => {
    try {
      setLoading(true);
      setError("");
      await setProjectImageThumbnail(imageId);
      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === dropIndex) {
      return;
    }

    const newImages = [...images];
    const [removed] = newImages.splice(draggedItem, 1);
    newImages.splice(dropIndex, 0, removed);

    setImages(newImages);
    setDraggedItem(null);

    try {
      setLoading(true);
      const imageIds = newImages.map((img) => img.id);
      await reorderProjectImages(projectId, imageIds);
    } catch (err) {
      setError(err.message);
      await loadImages();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-gallery-container">
      <div className="gallery-header">
        <h2>Thư viện ảnh dự án</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="add-image-form">
        <h3>Thêm ảnh mới</h3>
        <form onSubmit={handleAddImage}>
          <div className="form-group">
            <label htmlFor="imageUrl">URL ảnh *</label>
            <input
              id="imageUrl"
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageCaption">Chú thích</label>
            <input
              id="imageCaption"
              type="text"
              value={newImageCaption}
              onChange={(e) => setNewImageCaption(e.target.value)}
              disabled={loading}
              placeholder="Mô tả ngắn về ảnh"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm ảnh"}
          </button>
        </form>
      </div>

      <div className="images-grid">
        {images.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có ảnh nào. Thêm ảnh đầu tiên của bạn!</p>
          </div>
        ) : (
          images.map((image, index) => (
            <div
              key={image.id}
              className={`image-card ${draggedItem === index ? "dragging" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="image-wrapper">
                <img src={image.imageUrl} alt={image.caption || "Project image"} />
                {image.isThumbnail && (
                  <div className="thumbnail-badge">Ảnh đại diện</div>
                )}
              </div>

              {editingImage === image.id ? (
                <div className="image-edit-form">
                  <input
                    type="text"
                    defaultValue={image.caption || ""}
                    placeholder="Chú thích"
                    onBlur={(e) =>
                      handleUpdateImage(image.id, { caption: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateImage(image.id, { caption: e.target.value });
                      }
                    }}
                    autoFocus
                  />
                  <button
                    className="btn-save"
                    onClick={() => setEditingImage(null)}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div className="image-caption">
                  {image.caption || "Không có chú thích"}
                </div>
              )}

              <div className="image-actions">
                <button
                  className="action-btn"
                  onClick={() => setEditingImage(image.id)}
                  title="Chỉnh sửa chú thích"
                >
                  ✏️
                </button>
                {!image.isThumbnail && (
                  <button
                    className="action-btn"
                    onClick={() => handleSetThumbnail(image.id)}
                    title="Đặt làm ảnh đại diện"
                  >
                    ⭐
                  </button>
                )}
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteImage(image.id)}
                  title="Xóa ảnh"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {images.length > 0 && (
        <div className="gallery-footer">
          <p className="hint">
            💡 Kéo và thả ảnh để sắp xếp lại thứ tự hiển thị
          </p>
        </div>
      )}
    </div>
  );
}
