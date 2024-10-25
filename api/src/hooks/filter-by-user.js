import { checkContext } from 'feathers-hooks-common'

export const filterByUser =
  (options = {}) =>
  async (context) => {
    checkContext(context, 'before', ['find'])
    const { user, query } = context.params
    const { is_trash = false } = query

    if (!user) return context

    if (user.is_admin && is_trash) return context

    context.params.query.owner = user._id

    return context
  }
