import { useEffect, useState } from "react";
import moment from "moment";
import { SmallContainer } from "src/components/Container";
import { Folder } from "./Folder";
import { fileService } from "src/config/apiClient";
import { ShareIcon } from "src/components/Icons";
import { FileFormModal } from "./Components/FileForm";


export const SharedDir = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);


  const [currentElement, setCurrentElement] = useState({})

  const [isOpenViewFile, setIsOpenViewFile] = useState(false);
  const toggleViewFile = () => setIsOpenViewFile(value => !value)

  const viewFile = (element) => {
    setIsOpenViewFile(true)
    setCurrentElement(element)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const resultFiles = await fileService.find({
        query: {
          $limit: 50,
          is_trash: false,
          is_shared: true,
          $sort: {
            name: 1
          }
        }
      })
      setItems([...resultFiles.data.map((file) => ({ ...file, isFile: true }))])
    } catch (error) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <SmallContainer loading={loading} className="my-5">
      <h2>Archivos compartidos <ShareIcon /></h2>
      <FileFormModal toggle={toggleViewFile} isOpen={isOpenViewFile} id={currentElement._id} view={true} />
      <Folder items={items} basePath="/folder/shared" loadData={loadData} viewFile={viewFile} isShared />
    </SmallContainer>
  )
}
