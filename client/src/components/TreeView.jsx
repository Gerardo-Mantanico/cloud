import { useState } from "react";
import TreeView from "react-accessible-treeview";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";


export function DirectoryTreeView({
  loadChildren = async () => { },
  name = "", classNameContainer,
  path = "/",
  isMove = false,
  moveElement = () => { }
}) {

  const navigate = useNavigate();

  const [data, setData] = useState(
    [
      {
        name: "/",
        id: 0,
        children: [-1],
        parent: null,
      },
      {
        name,
        id: -1,
        children: [],
        parent: 0,
        isBranch: true,
      }
    ]
  );
  // const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);

  const updateTreeData = (list, id, children) => {
    const data = list.map((node) => {
      if (node.id === id) {
        node.children = children.map((el) => {
          return el.id;
        });
      }
      return node;
    });
    return data.concat(children);
  };

  const onLoadData = async ({ element }) => {
    if (element.children.length > 0) {
      return;
    }

    const newData = await loadChildren(element.id === -1 ? null : element.id);

    setData((value) =>
      updateTreeData(value, element.id, newData)
    );


  };

  return (
    <div>
      <div className={`directory bg-dark ${classNameContainer}`}>
        <TreeView
          onLoadData={onLoadData}
          data={data}
          aria-label="directory tree"
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
            handleExpand,
            handleSelect
          }) => {
            const branchNode = (isExpanded, element) => {
              return isExpanded && element.children.length === 0 ? (
                <>
                  <span
                    role="alert"
                    aria-live="assertive"
                    className="visually-hidden"
                  >
                    loading {element.name}
                  </span>
                  {/* <i
                    aria-hidden={true}
                    className="loading-icon bi bi-hourglass"
                  /> */}
                </>
              ) : (
                null
              );
            };

            return (
              <div {...getNodeProps({ onClick: handleExpand })} style={{ paddingLeft: 10 * (level - 1) }}>
                {isBranch && branchNode(isExpanded, element)}
                {isBranch ? (
                  <FolderIcon isOpen={isExpanded} />
                ) : (
                  <FileIcon extension={"html"} />
                )}
                {element.name}
                {isMove ? (
                  <Button
                    color="link"
                    onClick={(e) => {
                      moveElement(element.id === -1 ? null : element.id)
                      e.stopPropagation();
                    }}>
                    <i className="bi bi-check2-square" />
                    Mover
                  </Button>
                ) : (
                  <Button color="link" onClick={(e) => {
                    const fullPath = element.id !== -1 ? `${path}/${element.id}` : path
                    navigate(fullPath)
                    e.stopPropagation();
                  }}><i className="bi bi-box-arrow-in-up-right" /></Button>
                )}

              </div>
            )
          }}
        />
      </div>
    </div>
  );
}

const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <i className="bi bi-folder2-open" />
  ) : (
    <i className="bi bi-folder2" />
  );

const FileIcon = ({ extension }) => {
  let fileIconClass = "";
  switch (extension) {
    case "txt": fileIconClass = "bi bi-filetype-txt"; break;
    case "png": fileIconClass = "bi bi-filetype-txt"; break;
    case "jpg": fileIconClass = "bi bi-filetype-txt"; break;
    case "html": fileIconClass = "bi bi-filetype-html"; break;
    default: fileIconClass = "bi bi-file-earmark";
  }
  return <i className={fileIconClass} />
};

