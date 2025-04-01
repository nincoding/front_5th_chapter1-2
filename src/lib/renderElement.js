import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // vNode를 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 기존 DOM이 없으면 새로 생성
  if (!container.firstChild) {
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);
  } else {
    // 기존 DOM이 있으면 업데이트
    updateElement(container, normalizedVNode, container.firstChild);
  }

  // 이벤트 리스너 설정
  const cleanup = setupEventListeners(container);

  // cleanup 함수를 반환하여 필요 시 이벤트 리스너를 제거할 수 있도록 함
  return cleanup;
}
