import { Router }              from 'express';
import * as postController     from '../controllers/post.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validate }            from '../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from '../validators/post.validator.js';

const router = Router();

// Specific routes FIRST 
router.get('/user/my-posts',
  protect,
  postController.getMyPosts
);

router.get('/admin/all',
  protect,
  restrictTo('admin'),
  postController.adminGetAllPosts
);

//  General routes 
router.get('/',    postController.getAllPosts);

router.post('/',
  protect,
  validate(createPostSchema),
  postController.createPost
);

//  Parameterized routes LAST (/:id must always be last)
router.get('/:id',  postController.getPostById);

router.put('/:id',
  protect,
  validate(updatePostSchema),
  postController.updatePost
);

router.delete('/:id',
  protect,
  postController.deletePost
);

export default router;