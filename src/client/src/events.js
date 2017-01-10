
export const VIEW_ORG = 'view-org';
export const VIEW_REPO = 'view-repo';

export function viewRepo(element) {
  return new CustomEvent(VIEW_REPO, {
    bubbles: true,
    composed: true,
    detail: {
      element: element
    }
  });
}

export function viewOrg(element) {
  return new CustomEvent(VIEW_ORG, {
    bubbles: true,
    composed: true,
    detail: {
      element: element
    }
  });
}
