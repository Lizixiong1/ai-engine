import React, { useState } from "react";
import { FormStore } from "../../FormStore";
import "./index.css";

const FormDesign: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Mock form controls available for drag-and-drop
  const formControls = [
    { type: "input", label: "文本输入框" },
    { type: "textarea", label: "多行文本框" },
    { type: "select", label: "下拉选择框" },
    { type: "checkbox", label: "复选框" },
    { type: "radio", label: "单选按钮" },
    { type: "date", label: "日期选择器" },
    { type: "number", label: "数字输入框" },
    { type: "switch", label: "开关" },
  ];

  return (
    <div className="vscode-dark-theme">
      <div className="form-designer-container">
        {/* Header */}
        <header className="form-designer-header">
          <h2 className="form-designer-title">表单设计器</h2>
          <div className="form-designer-toolbar">
            <button className="toolbar-button">保存</button>
            <button className="toolbar-button">预览</button>
            <button className="toolbar-button">发布</button>
          </div>
        </header>

        {/* Main Content */}
        <div className="form-designer-main">
          {/* Left Sidebar - Controls */}
          <aside className="form-designer-sidebar">
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">控件列表</h3>
              {formControls.map((control, index) => (
                <div
                  key={index}
                  className="control-item"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("controlType", control.type);
                  }}
                >
                  {control.label}
                </div>
              ))}
            </section>

            <section className="sidebar-section">
              <h3 className="sidebar-section-title">布局组件</h3>
              <div className="control-item" draggable>
                单列布局
              </div>
              <div className="control-item" draggable>
                两列布局
              </div>
              <div className="control-item" draggable>
                表格布局
              </div>
            </section>
          </aside>

          {/* Canvas Area */}
          <main className="form-canvas">
            <div className="canvas-grid">
              <div className="form-field-placeholder">
                拖拽控件到此处开始设计表单
              </div>

              {/* Example form field */}
              <div
                className={`form-field ${
                  selectedField === "field1" ? "selected" : ""
                }`}
                onClick={() => setSelectedField("field1")}
              >
                <label className="property-label">姓名</label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  className="property-input"
                />

                <div className="form-field-actions">
                  <button className="action-button">✏️</button>
                  <button className="action-button">🗑️</button>
                </div>
              </div>

              {/* Another example field */}
              <div
                className={`form-field ${
                  selectedField === "field2" ? "selected" : ""
                }`}
                onClick={() => setSelectedField("field2")}
              >
                <label className="property-label">邮箱</label>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  className="property-input"
                />

                <div className="form-field-actions">
                  <button className="action-button">✏️</button>
                  <button className="action-button">🗑️</button>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar - Properties */}
          <aside className="form-designer-properties">
            <section className="property-group">
              <h3 className="sidebar-section-title">属性设置</h3>

              {selectedField ? (
                <>
                  <div className="property-group">
                    <label className="property-label">字段名</label>
                    <input
                      type="text"
                      className="property-input"
                      defaultValue={selectedField}
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">标签</label>
                    <input
                      type="text"
                      className="property-input"
                      defaultValue={
                        selectedField === "field1" ? "姓名" : "邮箱"
                      }
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">占位符</label>
                    <input
                      type="text"
                      className="property-input"
                      defaultValue={
                        selectedField === "field1" ? "请输入姓名" : "请输入邮箱"
                      }
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">验证规则</label>
                    <select className="property-input">
                      <option>无</option>
                      <option>必填</option>
                      <option>邮箱格式</option>
                      <option>手机号格式</option>
                    </select>
                  </div>
                </>
              ) : (
                <p className="property-label">请选择一个字段来编辑其属性</p>
              )}
            </section>

            <section className="property-group">
              <h3 className="sidebar-section-title">表单预览</h3>
              <div className="form-preview">
                <div style={{ marginBottom: "12px" }}>
                  <label className="property-label">姓名</label>
                  <input
                    type="text"
                    placeholder="请输入姓名"
                    className="property-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label className="property-label">邮箱</label>
                  <input
                    type="email"
                    placeholder="请输入邮箱"
                    className="property-input"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FormDesign;
