import React from "react";
import { useRouter } from "next/router";
import Tree, { TreeNode } from "rc-tree";
import AddCircle from "remixicon-react/AddCircleLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import EditCircle from "remixicon-react/EditCircleLineIcon";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { DataNode, EventDataNode, Key } from "rc-tree/lib/interface";
import { IAddEditProfileModal } from "./ConnectedDataProfile";
import { TreeNodeClass } from "../utils/TreeNodeClass";

interface IDataNode extends DataNode {
  props: {
    eventKey: string;
  };
}

export const DataProfileTree = ({
  rootNode,
  setAddDataProfileModal,
  setEditDataProfileModal,
}: {
  rootNode: TreeNodeClass | null;
  setAddDataProfileModal: (value: IAddEditProfileModal) => void;
  setEditDataProfileModal: (value: IAddEditProfileModal) => void;
}) => {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = React.useState(["0-1", "0-1-1"]);

  const onSelect = (newSelectedKeys: Key[]) => {
    const updatedValues: string[] = [];
    if (newSelectedKeys.length) {
      newSelectedKeys.forEach((key) => updatedValues.push(key.toString()));
    }
    setSelectedKeys(updatedValues);
  };

  const onRightClick = (info: {
    event: React.MouseEvent<Element, MouseEvent>;
    node: EventDataNode<IDataNode>;
  }) => {
    setSelectedKeys([info.node.props.eventKey]);
  };

  const renderSubNodes = (node: TreeNodeClass) => {
    const customLabel = (
      <div className="flex gap-x-4 group">
        <p>{node.data.name}</p>
        <div className="flex gap-x-2 items-center opacity-0 group-hover:opacity-100">
          <Button
            id={`add-profile-${node.data.name}`}
            onClick={(e) => {
              e.preventDefault();
              setAddDataProfileModal({ visible: true, id: node.data.id });
              // router.push(`crm/profile/add/${node.data.id}`);
            }}
            userEventName={"dataProfile-newProfile:modal-click"}
            customStyle={""}
          >
            <AddCircle size={18} />
          </Button>
          <Button
            id={`edit-profile-${node.data.name}`}
            onClick={(e) => {
              e.preventDefault();
              setEditDataProfileModal({ visible: true, id: node.data.id });
              // router.push(`crm/profile/edit/${node.data.id}`);
            }}
            userEventName={"dataProfile-editProfile:modal-click"}
            customStyle={""}
          >
            <EditCircle size={18} />
          </Button>
          {node.data.parentId && (
            <a
              id={`delete-profile-${node.data.name}-link`}
              onClick={(e) => {
                e.preventDefault();
                router.push(`crm/profile/delete/${node.data.id}`);
              }}
              data-testid={`delete-profile-${node.data.name}-link`}
            >
              <DeleteIcon size={18} />
            </a>
          )}
        </div>
      </div>
    );

    return (
      <TreeNode
        title={customLabel}
        key={node.data.id}
        data-testid={`node-${node.data.name}`}
      >
        {node?.childNodes?.map((node) => renderSubNodes(node))}
      </TreeNode>
    );
  };

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, []);

  const getAllRootNodeIds = (rootNode: TreeNodeClass) => {
    let expandedKeys: string[] = [];
    const rootNodeKey = (rootNode: TreeNodeClass) => {
      if (rootNode.childNodes?.length > 0) {
        expandedKeys.push(rootNode?.data?.id);
        rootNode?.childNodes?.forEach((node) => rootNodeKey(node));
      } else {
        return expandedKeys.push(rootNode?.data?.id);
      }
    };
    rootNodeKey(rootNode);
    return expandedKeys;
  };

  return (
    <div ref={heightRef} className="overflow-y-auto">
      {rootNode ? (
        <div className="mt-6">
          <Tree
            onRightClick={onRightClick}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            multiple
            defaultExpandAll
            defaultExpandParent
            autoExpandParent
            showLine
            showIcon={false}
            selectable={false}
            expandedKeys={getAllRootNodeIds(rootNode)}
          >
            {renderSubNodes(rootNode)}
          </Tree>
        </div>
      ) : (
        <div className="mt-36 text-sm text-center">No profile found</div>
      )}
    </div>
  );
};
