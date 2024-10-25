import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { SmallContainer } from "src/components/Container";
import { Folder } from "./Folder";
import { directoryService, fileService } from "src/config/apiClient";
import { TrashFillIcon } from "src/components/Icons";
import { FileFormModal } from "./Components/FileForm";


export const TrashDir = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [dirData, setDirData] = useState({});
  const [loading, setLoading] = useState(false);


  const [currentElement, setCurrentElement] = useState({})

  const [isOpenViewFile, setIsOpenViewFile] = useState(false);
  const toggleViewFile = () => setIsOpenViewFile(value => !value)

  const viewFile = (element) => {
    setIsOpenViewFile(true)
    setCurrentElement(element)
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)

        const resultDir = id ? await directoryService.get(id) : {}
        setDirData(resultDir)

        const parentIdQuery = {}
        parentIdQuery.parent_id = id ?? { $exists: false }

        const resultDirectories = await directoryService.find({
          query: {
            $limit: 50,
            is_trash: true,
            ...parentIdQuery,
            $sort: {
              name: 1
            }
          }
        })

        const resultFiles = await fileService.find({
          query: {
            $limit: 50,
            is_trash: true,
            ...parentIdQuery,
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
    })()
  }, [id])

  return (
    <SmallContainer loading={loading} className="my-5">
      <h2>Papelera <TrashFillIcon /></h2>
      <FileFormModal toggle={toggleViewFile} isOpen={isOpenViewFile} id={currentElement._id} view={true} />
      <Folder items={items} basePath="/folder/trash" previous={dirData.parent_id} parentId={id} viewFile={viewFile} />
    </SmallContainer>
  )
}
