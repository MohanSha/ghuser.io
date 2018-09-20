Don't mount S3 buckets with [s3fs](https://github.com/s3fs-fuse/s3fs-fuse) because:

* [it's very slow](https://serverfault.com/questions/396100/s3fs-performance-improvements-or-alternative)
  for us because we have thousands of small files, and
* [it spuriously gets stuck](https://github.com/s3fs-fuse/s3fs-fuse/issues/441).
