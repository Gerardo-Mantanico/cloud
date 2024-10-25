import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { Button } from "reactstrap";
import { SmallContainer } from "src/components/Container";
import { Folder } from "./Folder";
import { directoryService, fileService } from "src/config/apiClient";
import { FileIcon, FolderIcon, FolderOpenIcon, TxtIcon } from "src/components/Icons";
import { MoveElementModal } from "./Components/MoveElement";
import { ShareElementModal } from "./Components/ShareElement";
import { DirectoryModal } from "./Components/DirectoryForm";
import { FileFormModal } from "./Components/FileForm";


export const RootDir = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [dirData, setDirData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const toggle = () => setOpenModal(value => !value)
  const [currentElement, setCurrentElement] = useState({})


  const [isOpenShare, setIsOpenShare] = useState(false);
  const toggleShare = () => setIsOpenShare(value => !value)


  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const toggleCreate = () => setIsOpenCreate(value => !value)

  const [isOpenFile, setIsOpenFile] = useState(false);
  const toggleFile = () => setIsOpenFile(value => !value)


  const [isOpenEditFile, setIsOpenEditFile] = useState(false);
  const toggleEditFile = () => setIsOpenEditFile(value => !value)

  const [isOpenViewFile, setIsOpenViewFile] = useState(false);
  const toggleViewFile = () => setIsOpenViewFile(value => !value)

  const moveElement = (element) => {
    setOpenModal(true)
    setCurrentElement(element)
  }

  const shareElement = (element) => {
    setIsOpenShare(true)
    setCurrentElement(element)
  }

  const editFile = (element) => {
    setIsOpenEditFile(true)
    setCurrentElement(element)
  }


  const viewFile = (element) => {
    setIsOpenViewFile(true)
    setCurrentElement(element)
  }

  const loadData = async (id) => {
    try {
      setLoading(true)

      const resultDir = id ? await directoryService.get(id) : {}
      setDirData(resultDir)

      const resultDirectories = await directoryService.find({
        query: {
          $limit: 50,
          is_trash: false,
          parent_id: id ?? { $exists: false },
          $sort: {
            name: 1
          }
        }
      })

      const resultFiles = await fileService.find({
        query: {
          $limit: 50,
          is_trash: false,
          is_shared: { $ne: true },
          parent_id: id ?? { $exists: false },
          $sort: {
            name: 1
          }
        }
      })
      setItems([...resultDirectories.data, ...resultFiles.data.map((file) => ({ ...file, isFile: true }))])
    } catch (error) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(id)
  }, [id])

  return (
    <SmallContainer loading={loading} className="my-5">
      <FileFormModal toggle={toggleEditFile} isOpen={isOpenEditFile} loadData={() => loadData(id)} id={currentElement._id} edit={true} />
      <FileFormModal toggle={toggleFile} isOpen={isOpenFile} loadData={() => loadData(id)} />
      <DirectoryModal toggle={toggleCreate} isOpen={isOpenCreate} loadData={() => loadData(id)} />
      <MoveElementModal toggle={toggle} isOpen={openModal} item={currentElement} loadData={() => loadData(id)} />
      <ShareElementModal toggle={toggleShare} isOpen={isOpenShare} item={currentElement} />
      <h2>Mis archivos <FolderIcon /></h2>
      <div className="my-2 d-flex align-items-center justify-content-start">
        <Button onClick={toggleCreate}>
          + <FolderOpenIcon />
        </Button>

        <Button className="mx-2" onClick={toggleFile}>
          + <FileIcon />
        </Button>
      </div>
      <Folder
        items={items}
        basePath="/folder/root"
        previous={dirData.parent_id}
        parentId={id}
        loadData={() => loadData(id)}
        moveElement={moveElement}
        shareElement={shareElement}
        editFile={editFile}
        viewFile={viewFile}
      />
    </SmallContainer>
  )
}
