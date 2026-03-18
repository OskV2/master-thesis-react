/**
 * Binary Search Tree (BST) — step-generating implementation for visualization.
 *
 * Operations: insert, search, delete, in-order traversal.
 * Each operation generates steps capturing the tree state and highlights.
 *
 * Tree is stored as a flat structure (nodes array + root reference)
 * for easy serialization into visualization steps.
 *
 * Step types:
 *   "insert-compare"  — comparing value with current node
 *   "insert-place"    — placing new node
 *   "search-compare"  — comparing during search
 *   "search-found"    — value found
 *   "search-not-found"— value not in tree
 *   "delete-find"     — finding node to delete
 *   "delete-case"     — handling delete case (leaf / one child / two children)
 *   "delete-done"     — deletion complete
 *   "traverse-visit"  — visiting node during traversal
 */

// ── Internal tree structure ──

class BSTNode {
  constructor(value, id) {
    this.value = value;
    this.id = id;
    this.left = null;
    this.right = null;
  }
}

/**
 * Serialize a BST rooted at `node` into a flat array suitable for rendering.
 * Each entry: { id, value, left (id|null), right (id|null), x, y, depth }
 * Positions are computed via in-order assignment.
 */
function serializeTree(root) {
  if (!root) return [];

  const nodes = [];
  let posCounter = 0;

  function inOrder(node, depth) {
    if (!node) return;
    inOrder(node.left, depth + 1);
    nodes.push({
      id: node.id,
      value: node.value,
      leftId: node.left?.id ?? null,
      rightId: node.right?.id ?? null,
      depth,
      inOrderPos: posCounter++,
    });
    inOrder(node.right, depth + 1);
  }

  inOrder(root, 0);
  return nodes;
}

/**
 * BST class that generates visualization steps for each operation.
 */
export class BST {
  constructor() {
    this.root = null;
    this.nextId = 0;
  }

  _newId() {
    return this.nextId++;
  }

  _makeStep(type, extra = {}) {
    return {
      type,
      tree: serializeTree(this.root),
      highlighted: extra.highlighted ?? [],
      path: extra.path ?? [],
      description: extra.description ?? "",
      ...extra,
    };
  }

  /**
   * Insert a value. Returns array of steps.
   */
  insert(value) {
    const steps = [];
    const path = [];

    const newNode = new BSTNode(value, this._newId());

    if (!this.root) {
      this.root = newNode;
      steps.push(
        this._makeStep("insert-place", {
          highlighted: [newNode.id],
          description: `Drzewo puste — ${value} staje się korzeniem.`,
        })
      );
      return steps;
    }

    let current = this.root;

    while (true) {
      path.push(current.id);

      steps.push(
        this._makeStep("insert-compare", {
          highlighted: [current.id],
          path: [...path],
          description: `Porównanie: ${value} ${value < current.value ? "<" : value > current.value ? ">" : "="} ${current.value}`,
        })
      );

      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          path.push(newNode.id);
          steps.push(
            this._makeStep("insert-place", {
              highlighted: [newNode.id],
              path: [...path],
              description: `Wstawiono ${value} jako lewe dziecko ${current.value}.`,
            })
          );
          return steps;
        }
        current = current.left;
      } else if (value > current.value) {
        if (current.right === null) {
          current.right = newNode;
          path.push(newNode.id);
          steps.push(
            this._makeStep("insert-place", {
              highlighted: [newNode.id],
              path: [...path],
              description: `Wstawiono ${value} jako prawe dziecko ${current.value}.`,
            })
          );
          return steps;
        }
        current = current.right;
      } else {
        // Duplicate — can handle as desired
        steps.push(
          this._makeStep("insert-place", {
            highlighted: [current.id],
            path: [...path],
            description: `Wartość ${value} już istnieje w drzewie. Pominięto.`,
          })
        );
        return steps;
      }
    }
  }

  /**
   * Search for a value. Returns array of steps.
   */
  search(value) {
    const steps = [];
    const path = [];
    let current = this.root;

    while (current !== null) {
      path.push(current.id);

      steps.push(
        this._makeStep("search-compare", {
          highlighted: [current.id],
          path: [...path],
          description: `Porównanie: ${value} ${value < current.value ? "<" : value > current.value ? ">" : "="} ${current.value}`,
        })
      );

      if (value === current.value) {
        steps.push(
          this._makeStep("search-found", {
            highlighted: [current.id],
            path: [...path],
            description: `Znaleziono ${value}!`,
          })
        );
        return steps;
      }

      current = value < current.value ? current.left : current.right;
    }

    steps.push(
      this._makeStep("search-not-found", {
        path: [...path],
        description: `Wartość ${value} nie została znaleziona w drzewie.`,
      })
    );

    return steps;
  }

  /**
   * Delete a value. Returns array of steps.
   */
  delete(value) {
    const steps = [];

    const deleteNode = (node, parent, isLeft) => {
      if (!node) {
        steps.push(
          this._makeStep("search-not-found", {
            description: `Wartość ${value} nie istnieje w drzewie.`,
          })
        );
        return;
      }

      steps.push(
        this._makeStep("delete-find", {
          highlighted: [node.id],
          description: `Szukanie ${value}: porównanie z ${node.value}`,
        })
      );

      if (value < node.value) {
        deleteNode(node.left, node, true);
      } else if (value > node.value) {
        deleteNode(node.right, node, false);
      } else {
        // Found the node to delete
        if (!node.left && !node.right) {
          // Case 1: Leaf node
          steps.push(
            this._makeStep("delete-case", {
              highlighted: [node.id],
              description: `${value} jest liściem — usuwanie bezpośrednie.`,
            })
          );

          if (!parent) this.root = null;
          else if (isLeft) parent.left = null;
          else parent.right = null;
        } else if (!node.left || !node.right) {
          // Case 2: One child
          const child = node.left ?? node.right;

          steps.push(
            this._makeStep("delete-case", {
              highlighted: [node.id, child.id],
              description: `${value} ma jedno dziecko (${child.value}) — zastąpienie.`,
            })
          );

          if (!parent) this.root = child;
          else if (isLeft) parent.left = child;
          else parent.right = child;
        } else {
          // Case 3: Two children — find in-order successor
          let successor = node.right;
          let successorParent = node;

          while (successor.left) {
            successorParent = successor;
            successor = successor.left;
          }

          steps.push(
            this._makeStep("delete-case", {
              highlighted: [node.id, successor.id],
              description: `${value} ma dwoje dzieci. Następnik in-order: ${successor.value}.`,
            })
          );

          node.value = successor.value;

          if (successorParent === node) {
            successorParent.right = successor.right;
          } else {
            successorParent.left = successor.right;
          }
        }

        steps.push(
          this._makeStep("delete-done", {
            description: `Usunięto ${value} z drzewa.`,
          })
        );
      }
    };

    deleteNode(this.root, null, false);
    return steps;
  }

  /**
   * In-order traversal with step generation.
   */
  inOrderTraversal() {
    const steps = [];
    const visited = [];

    function traverse(node) {
      if (!node) return;

      traverse(node.left);

      visited.push(node.id);
      steps.push({
        type: "traverse-visit",
        tree: serializeTree(node), // Note: we use root in the caller
        highlighted: [node.id],
        visited: [...visited],
        description: `Odwiedzono: ${node.value}`,
      });

      traverse(node.right);
    }

    traverse(this.root);

    // Re-serialize with root for correct positions
    return steps.map((s) => ({
      ...s,
      tree: serializeTree(this.root),
    }));
  }

  /**
   * Build a tree from an array of values, returning all steps.
   */
  static buildFromArray(values) {
    const bst = new BST();
    const allSteps = [];

    for (const val of values) {
      const insertSteps = bst.insert(val);
      allSteps.push(...insertSteps);
    }

    return { bst, steps: allSteps };
  }
}
