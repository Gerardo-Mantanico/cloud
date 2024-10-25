import classNames from "classnames"
import { DirectoryTreeView } from "src/components/TreeView"
import { directoryService, fileService } from "src/config/apiClient"
import { useUser } from "src/utils/useUser"

export const Trees = () => {
  const formatData = (data = [], isFile = false) => data.map(({ _id: id, name, parent_id: parent }) => ({ id, name, parent: parent ?? -1, isBranch: !isFile, children: [] }))
  const user = useUser()

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

  const getSharedDirectory = async (id) => {
    // const result = await fileService.find({
    //   query: {
    //     $limit: 50,
    //     is_trash: false,
    //     parent_id: id ?? { $exists: false },
    //     is_shared: true,
    //   }
    // })

    // return formatData(result.data, true)
    return []
  }

  const getDeletedDirectory = async (id) => {
    try {

      const result = await directoryService.find({
        query: {
          $limit: 50,
          is_trash: true,
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
    <div className="w-100">
      <DirectoryTreeView loadChildren={getRootDirectory} name="Mis archivos" classNameContainer="pb-1" path="/folder/root" />
      <DirectoryTreeView loadChildren={getSharedDirectory} name="Compartido conmigo" classNameContainer={classNames("pt-1", {
        "py-1": user?.is_admin
      })} path="/folder/shared" />
      {user?.is_admin ?
        <DirectoryTreeView loadChildren={getDeletedDirectory} name="Papelera" classNameContainer="pt-1" path="/folder/trash" />
        : null
      }
    </div>
  )
}
