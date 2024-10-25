import { Card, ListGroup, ListGroupItem } from "reactstrap"
import { Link } from "react-router-dom"
import { Directory } from "src/components/Directory"

export const Folder = ({
  items = [],
  basePath = "",
  parentId = undefined,
  previous = undefined,
  loadData = () => { },
  moveElement = () => { },
  shareElement = () => { },
  editFile = () => { },
  viewFile = () => { },
  isShared = false
}) => {
  return (
    <Card
      className="w-100 my-3"
    >
      <ListGroup flush>
        {parentId ? (
          <ListGroupItem>
            <Link to={previous ? `${basePath}/${previous}` : basePath}>
              ..
            </Link>
          </ListGroupItem>
        ) : null}

        {items.map((item) => (
          <ListGroupItem key={item._id}>
            <Directory element={item} isFile={item.isFile} to={`${basePath}/${item._id}`} loadData={loadData} moveElement={moveElement} shareElement={shareElement} editFile={editFile}
              viewFile={viewFile} isShared={isShared} />
          </ListGroupItem>
        ))}
      </ListGroup>
      {items.length < 1 ? <h4 className="text-muted text-center my-5">Directorio vacío.</h4> : null}
    </Card>
  )
}
