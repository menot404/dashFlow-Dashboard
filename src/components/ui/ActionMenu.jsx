// src/components/ui/ActionMenu.jsx
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { MoreVertical, Eye, Edit, Trash2, Copy, Download } from 'lucide-react'
import clsx from 'clsx'

/**
 * Composant ActionMenu : menu d'actions contextuelles (table, cartes)
 * Affiche les options de vue, édition, suppression, copie, téléchargement
 */
const ActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopy,
  onDownload,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onView}
                  className={clsx(
                    'flex items-center w-full px-4 py-2 text-sm',
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onEdit}
                  className={clsx(
                    'flex items-center w-full px-4 py-2 text-sm',
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
              )}
            </Menu.Item>

            {onCopy && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onCopy}
                    className={clsx(
                      'flex items-center w-full px-4 py-2 text-sm',
                      active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier ID
                  </button>
                )}
              </Menu.Item>
            )}

            {onDownload && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onDownload}
                    className={clsx(
                      'flex items-center w-full px-4 py-2 text-sm',
                      active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                )}
              </Menu.Item>
            )}
          </div>

          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onDelete}
                  className={clsx(
                    'flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400',
                    active ? 'bg-red-50 dark:bg-red-900/20' : ''
                  )}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ActionMenu