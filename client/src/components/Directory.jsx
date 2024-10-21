import { Button } from "reactstrap"
import { Link } from "react-router-dom"
import { FolderIcon, HtmlIcon, TxtIcon, PenIcon, CopyIcon, ShareIcon, ArrowsMoveIcon, TrashFillIcon, EyeFillIcon } from "./Icons"
import { deleteItem, copyItem } from "src/Folder/actions"
import moment from "moment"

const chooseFileIcon = (extension) => {
  if (extension === "html") return <HtmlIcon className="pe-2" />
  if (extension === "txt") return <TxtIcon className="pe-2" />
  return null
}

export const Directory = ({ element, isFile = false, to = "", loadData = async () => { }, moveElement = () => { }, shareElement = () => { }, editFile = () => { },
  viewFile = () => { }, isShared }) => {

  return (
    <div className="d-flex align-items-center justify-content-between" role="button">
      <h5 className="user-select-none">
        {!isFile ? (
          <Link to={to} className="text-decoration-none">
            <FolderIcon className="pe-2" />
            {element.name}
          </Link>) : (
          <>
            {chooseFileIcon(element.extension)}
            {element.name}.{element.extension}
          </>
        )}

      </h5>
      {/* Information */}
      {isShared ? (
        <div className="d-flex flex-column">
          <small className="m-0 mb-1">
            {element.sharedBy}
          </small>
          <small className="m-0 mb-1">
            {moment(element.createdAt).format('LLL')}
          </small>
        </div>
      ) : null}
      {/* Actions */}
      <div>
        {isFile ? (
          <>
            {element.is_shared || element.is_trash ? (
              <Button color="link" onClick={(e) => {
                viewFile(element)
                e.stopPropagation();
              }}><EyeFillIcon />
              </Button>
            ) : (
              <>
                <Button color="link" onClick={(e) => {
                  editFile(element)
                  e.stopPropagation();
                }}><PenIcon /></Button>
                <Button color="link" onClick={(e) => {
                  shareElement(element);
                  e.stopPropagation();
                }}><ShareIcon />
                </Button>
              </>
            )}
          </>
        ) : null}


        {!element.is_shared && !element.is_trash ? (
          <>
            <Button color="link" onClick={(e) => {
              copyItem(element, loadData)
              e.stopPropagation();
            }}><CopyIcon /></Button>
            <Button color="link" onClick={(e) => {
              moveElement(element)
              e.stopPropagation();
            }}><ArrowsMoveIcon /></Button>
          </>
        ) : null}

        {!element.is_trash ? (
          <Button color="link" onClick={(e) => {
            deleteItem(element, loadData)
            e.stopPropagation();
          }}><TrashFillIcon /></Button>
        ) : null}

      </div>

    </div>
  )
}
