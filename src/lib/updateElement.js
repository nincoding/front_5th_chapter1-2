import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  for (const [key, newValue] of Object.entries(newProps)) {
    if (newValue === oldProps[key]) continue;

    if (typeof newValue === "function") {
      addEvent(target, key.toLowerCase().substring(2), newValue);
      continue;
    }

    if (key === "className") {
      target.className = newValue;
      continue;
    }

    if (key in target) {
      target[key] = newValue;
      continue;
    }

    if (newValue != null && newValue !== false) {
      target.setAttribute(key, newValue);
    }
  }

  for (const key in oldProps) {
    if (key in newProps) continue;

    if (typeof oldProps[key] === "function") {
      removeEvent(target, key.toLowerCase().substring(2), oldProps[key]);
      continue;
    }

    if (key === "className") {
      target.className = "";
      continue;
    }

    if (key in target) {
      target[key] = "";
      continue;
    }

    target.removeAttribute(key);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (!newNode) {
    parentElement.removeChild(currentElement);
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), currentElement);
    return;
  }

  if (typeof newNode !== "object") {
    if (newNode !== oldNode) currentElement.nodeValue = newNode;
    return;
  }

  updateAttributes(currentElement, newNode.props ?? {}, oldNode.props ?? {});

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }
}
