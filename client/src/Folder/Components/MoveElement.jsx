import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DirectoryTreeView } from 'src/components/TreeView';
import { directoryService } from 'src/config/apiClient';
import { moveItem } from '../actions';

export const MoveElementModal = ({ toggle, isOpen, className = "", item, loadData = () => { } }) => {
  const formatData = (data = [], isFile = false) => data.map(({ _id: id, name, parent_id: parent }) => ({ id, name, parent: parent ?? -1, isBranch: !isFile, children: [] }))

  const getRootDirectory = async (id) => {
    try {
      const result = await directoryService.find({
        query: {
          $limit: 50,
          is_trash: false,
          parent_id: id ?? { $exists: false },
          $sort: {
            name: 1
          }
        }
      })
      return formatData(result.data)
    } catch (error) {
      return []
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Mover {item.name} {item.isFile ? `.${item.extension}` : ""}</ModalHeader>
        <ModalBody>
          <DirectoryTreeView
            loadChildren={getRootDirectory}
            name="Mover a"
            isMove
            moveElement={(newParentId) => moveItem(item, newParentId, () => { loadData(); toggle(); })}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
