import { permissions } from './permissions'
import { APP_SECRET, getUserId } from './utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { applyMiddleware } from 'graphql-middleware'
import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.nullable.field('woofById', {
      type: 'Woof',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.woof.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nonNull.list.nonNull.field('feed', {
      type: 'Woof',
      args: {
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'PostOrderByUpdatedAtInput',
        }),
      },
      resolve: (_parent, args, context: Context) => {
        const or = args.searchString
          ? {
            OR: [
              { content: { contains: args.searchString } },
            ],
          }
          : {}

        return context.prisma.woof.findMany({
          where: {
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined
        })
      },
    })

    // t.list.field('draftsByUser', {
    //   type: 'Woof',
    //   args: {
    //     userUniqueInput: nonNull(
    //       arg({
    //         type: 'UserUniqueInput',
    //       }),
    //     ),
    //   },
    //   resolve: (_parent, args, context: Context) => {
    //     return context.prisma.user
    //       .findUnique({
    //         where: {
    //           id: args.userUniqueInput.id || undefined,
    //           email: args.userUniqueInput.email || undefined,
    //         },
    //       })
    //       .woofs({
    //         where: {
    //           published: false,
    //         },
    //       })
    //   },
    // })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createDraft', {
      type: 'Woof',
      args: {
        data: nonNull(
          arg({
            type: 'WoofCreateInput',
          }),
        ),
      },
      resolve: (_, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.woof.create({
          data: {
            content: args.data.content,
            authorId: userId,
          },
        })
      },
    })

    // t.field('togglePublishPost', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: async (_, args, context: Context) => {
    //     try {
    //       const post = await context.prisma.woof.findUnique({
    //         where: { id: args.id || undefined }
    //       })
    //       return context.prisma.woof.update({
    //         where: { id: args.id || undefined },
    //         data: { published: !post?.published },
    //       })
    //     } catch (e) {
    //       throw new Error(
    //         `Post with ID ${args.id} does not exist in the database.`,
    //       )
    //     }
    //   },
    // })

    // t.field('incrementPostViewCount', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: (_, args, context: Context) => {
    //     return context.prisma.post.update({
    //       where: { id: args.id || undefined },
    //       data: {
    //         viewCount: {
    //           increment: 1,
    //         },
    //       },
    //     })
    //   },
    // })

    t.field('deleteWoof', {
      type: 'Woof',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.woof.delete({
          where: { id: args.id },
        })
      },
    })
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.nonNull.field('woofs', {
      type: 'Woof',
      resolve: (parent, _, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .woofs()
      },
    })
  },
})

// const Post = objectType({
//   name: 'Post',
//   definition(t) {
//     t.nonNull.int('id')
//     t.nonNull.field('createdAt', { type: 'DateTime' })
//     t.nonNull.field('updatedAt', { type: 'DateTime' })
//     t.nonNull.string('title')
//     t.string('content')
//     t.nonNull.boolean('published')
//     t.nonNull.int('viewCount')
//     t.field('author', {
//       type: 'User',
//       resolve: (parent, _, context: Context) => {
//         return context.prisma.post
//           .findUnique({
//             where: { id: parent.id || undefined },
//           })
//           .author()
//       },
//     })
//   },
// })

// schema for Woof
const Woof = objectType({
  name: 'Woof',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.string('content')
    t.field('author', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.woof
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author()
      },
    })
  },
})

// schema for Profile
const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.string('bio')
    t.string('location')
    t.string('website')
    t.string('avatar')
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.profile
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user()
      },
    })
  },
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' })
  },
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const WoofCreateInput = inputObjectType({
  name: 'WoofCreateInput',
  definition(t) {
    t.nonNull.string('content')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.list.nonNull.field('woofs', { type: 'WoofCreateInput' })
  },
})

const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

const schemaWithoutPermissions = makeSchema({
  types: [
    Query,
    Mutation,
    Woof,
    Profile,
    User,
    AuthPayload,
    UserUniqueInput,
    UserCreateInput,
    WoofCreateInput,
    SortOrder,
    PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
