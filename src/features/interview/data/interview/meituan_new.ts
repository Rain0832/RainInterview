/**
 * 从 question_data_base.md 35份面经中提取的新增题目
 * 已与现有 63 题完整去重，仅包含不重复的新题
 */
import type { InterviewQuestion } from '../interviewTypes';

export const newGroceryQuestions: InterviewQuestion[] = [
  // ==================== Java 基础 ====================
  { id: 'mt-new-java-1', title: 'ArrayList fast-fail 机制', content: 'ArrayList 的 fast-fail 机制是什么？什么情况下会触发？', category: 'Java', difficulty: '基础', referenceAnswer: 'modCount 机制：迭代器创建时记录 expectedModCount，每次 next() 检查是否与 modCount 一致，不一致则抛 ConcurrentModificationException。单线程也可能触发（边遍历边 remove），安全做法：Iterator.remove() 或 CopyOnWriteArrayList。', frequency: 'medium', source: '面经 1/15' },
  { id: 'mt-new-java-2', title: 'equals 与 hashCode 契约', content: '重写 equals 后为什么必须重写 hashCode？', category: 'Java', difficulty: '基础', referenceAnswer: '契约：equals 相等则 hashCode 必须相等。HashMap 先用 hashCode 定位桶再用 equals 精确匹配，若不重写 hashCode 会导致逻辑相等的对象散落在不同桶中，get 时找不到。', frequency: 'medium', source: '面经 4' },
  { id: 'mt-new-java-3', title: 'Integer 缓存池陷阱', content: 'Integer a=200, b=200, a==b 结果是什么？为什么？', category: 'Java', difficulty: '基础', referenceAnswer: 'false。Integer.valueOf() 对 -128~127 有缓存（IntegerCache），范围内 == 为 true（同一对象），超出范围新建对象 == 比较地址为 false。应使用 equals() 比较值。', frequency: 'medium', source: '面经 25' },
  { id: 'mt-new-java-4', title: 'Java 反射机制', content: '反射是怎么理解的？使用场景和优缺点？', category: 'Java', difficulty: '进阶', referenceAnswer: 'Class.forName()/getClass() 获取 Class 对象，可动态创建实例、调用方法、访问字段。场景：Spring IOC、动态代理、ORM 框架、序列化。优点：灵活、解耦。缺点：性能差(比直接调用慢)、破坏封装(可访问 private)、编译期不检查类型。', frequency: 'medium', source: '面经 31' },
  { id: 'mt-new-java-5', title: '两个线程交替打印', content: '两个线程交替打印 a 和 b 怎么实现？', category: 'Java', difficulty: '进阶', referenceAnswer: '方案一：synchronized + wait/notify；方案二：ReentrantLock + Condition；方案三：Semaphore 信号量(初始0和1)；方案四：LockSupport.park/unpark。推荐 Condition 方案，更灵活。', frequency: 'medium', source: '面经 25' },
  { id: 'mt-new-java-6', title: '内存泄漏场景', content: '什么情况下会导致内存泄漏？', category: 'Java', difficulty: '进阶', referenceAnswer: 'ThreadLocal 未 remove、静态集合持有引用、未关闭资源(IO/DB连接)、监听器/回调未注销、内部类持有外部类引用、缓存无上限无过期。排查：jmap -histo / MAT 分析 heap dump。', frequency: 'medium', source: '面经 3' },

  // ==================== Spring ====================
  { id: 'mt-new-spring-1', title: 'Spring 三级缓存解决循环依赖', content: 'Spring 怎么解决循环依赖？三级缓存分别是什么？', category: 'Java', difficulty: '进阶', referenceAnswer: '一级(singletonObjects)：完整 Bean；二级(earlySingletonObjects)：早期引用(已实例化未填充属性)；三级(singletonFactories)：ObjectFactory(延迟创建代理)。A→B→A 时：A 实例化后放三级缓存→B 需要 A→从三级获取早期引用→B 完成→A 完成。注意：构造器注入和 prototype 无法解决。', frequency: 'high', source: '面经 12/20/21/25' },
  { id: 'mt-new-spring-2', title: '@Transactional 失效场景', content: 'Spring 声明式事务什么时候会失效？底层原因是什么？', category: 'Java', difficulty: '进阶', referenceAnswer: '1)private 方法(代理无法拦截) 2)同类 this 调用(绕过代理) 3)异常被 catch 吞掉 4)非 RuntimeException 未配置 rollbackFor 5)final/static 方法 6)非 Spring 管理的 Bean。本质：都是动态代理失效的问题。AOP 代理对象 ≠ 原始对象。', frequency: 'high', source: '面经 7/10/12/21/27/34' },
  { id: 'mt-new-spring-3', title: 'Spring 事务传播机制', content: 'Spring 事务传播机制有哪些？底层原理？', category: 'Java', difficulty: '进阶', referenceAnswer: '7种：REQUIRED(默认,有则加入)、REQUIRES_NEW(挂起当前新建)、NESTED(保存点回滚)、SUPPORTS/NOT_SUPPORTED/MANDATORY/NEVER。底层：TransactionSynchronizationManager + ThreadLocal 绑定 Connection，NESTED 用 SAVEPOINT 实现。', frequency: 'medium', source: '面经 12/21' },
  { id: 'mt-new-spring-4', title: 'MyBatis 原理 / PageHelper 分页', content: 'MyBatis 简单的底层原理？分页插件 PageHelper 原理？', category: 'Java', difficulty: '进阶', referenceAnswer: 'MyBatis 通过动态代理为 Mapper 接口生成实现类(MapperProxy)，SqlSession 执行 SQL。PageHelper 基于 MyBatis 拦截器(Interceptor)，在 SQL 执行前自动添加 LIMIT 和 COUNT 查询。总数量通过 SELECT COUNT(*) 自动生成的查询获取。', frequency: 'medium', source: '面经 10/27' },

  // ==================== MySQL ====================
  { id: 'mt-new-mysql-1', title: '索引失效场景汇总', content: '哪些情况下索引会失效？联合索引(A,B)查 B AND A 会失效吗？', category: 'MySQL', difficulty: '进阶', referenceAnswer: '失效场景：函数/隐式转换、LIKE "%xx"、OR 条件(非都有索引)、NOT IN、IS NULL(看情况)、范围查询后的联合索引列。联合索引(A,B) 查 B AND A 不失效——MySQL 优化器自动调整顺序。LIKE "A%" 走索引，LIKE "%A" 不走。', frequency: 'high', source: '面经 3/4/6/9/24/34' },
  { id: 'mt-new-mysql-2', title: 'MySQL 三大日志', content: 'MySQL 的三个 log(binlog/redo log/undo log)分别做什么？', category: 'MySQL', difficulty: '进阶', referenceAnswer: 'redo log(InnoDB)：物理日志，保证持久性(crash recovery)，WAL 先写日志再写磁盘。undo log(InnoDB)：逻辑日志，保证原子性(回滚)+MVCC 版本链。binlog(Server 层)：逻辑日志，用于主从复制和 PITR。二阶段提交保证 redo log 与 binlog 一致。', frequency: 'medium', source: '面经 8' },
  { id: 'mt-new-mysql-3', title: 'MySQL 主从复制原理', content: '数据库主从复制的实现原理？传的是 SQL 还是数据行？', category: 'MySQL', difficulty: '进阶', referenceAnswer: '主库写 binlog → 从库 IO 线程拉取写 relay log → 从库 SQL 线程重放。binlog 格式：STATEMENT(SQL语句,可能不一致)、ROW(数据行,体积大但精确)、MIXED(混合)。延迟优化：并行复制、半同步复制(至少一个从库确认)。', frequency: 'medium', source: '面经 11/18/22' },
  { id: 'mt-new-mysql-4', title: '深分页优化', content: '了解过深分页吗？LIMIT 1000000,10 怎么优化？', category: 'MySQL', difficulty: '进阶', referenceAnswer: '问题：需扫描 1000010 行。优化：1)子查询 WHERE id >= (SELECT id FROM t ORDER BY id LIMIT 1000000,1) LIMIT 10；2)游标分页 WHERE id > last_id LIMIT 10(推荐)；3)覆盖索引+延迟关联；4)业务限制禁止跳页。', frequency: 'medium', source: '面经 3' },
  { id: 'mt-new-mysql-5', title: '分库分表实践与权衡', content: '分库分表一般用在什么场景？具体逻辑？有什么痛点？', category: 'MySQL', difficulty: '进阶', referenceAnswer: '场景：单表超千万行或查询性能瓶颈。策略：range(按时间)/hash(按 ID)/按业务。痛点：跨分片 JOIN、全局排序分页、分布式事务、全局唯一 ID(Snowflake)。核心认知：分表是业务逻辑与查询性能的权衡，没有万能方案。', frequency: 'medium', source: '面经 8/10/27' },

  // ==================== Redis 补充 ====================
  { id: 'mt-new-redis-1', title: 'Redis 为什么快', content: 'Redis 为什么这么快？', category: 'Redis', difficulty: '基础', referenceAnswer: '1)纯内存操作 2)单线程避免上下文切换和锁竞争 3)IO 多路复用(epoll) 4)高效数据结构(SDS/ziplist/skiplist/intset) 5)通信协议简单(RESP)。Redis 6.0+ 多线程仅用于网络 IO 读写，命令执行仍是单线程。', frequency: 'high', source: '面经 1/15/28' },
  { id: 'mt-new-redis-2', title: 'Redis 缓存穿透/击穿/雪崩', content: '用 Redis 缓存可能带来哪些问题？', category: 'Redis', difficulty: '进阶', referenceAnswer: '穿透：查不存在的数据→布隆过滤器/空值缓存。击穿：热 key 过期→互斥锁/永不过期+异步刷新。雪崩：大批 key 同时过期→过期时间加随机值/多级缓存/限流降级。', frequency: 'medium', source: '面经 25/26' },

  // ==================== 消息队列 ====================
  { id: 'mt-new-mq-1', title: 'MQ 消息不丢失', content: '使用 MQ 时怎么确保消息 100% 不丢失？', category: '分布式系统', difficulty: '进阶', referenceAnswer: '三端保障：生产者(confirm/事务消息)、Broker(持久化+副本 ISR 同步)、消费者(手动 ACK，成功后才确认)。Kafka：acks=all + min.insync.replicas。RabbitMQ：publisher confirm + durable queue + 手动 ACK。', frequency: 'high', source: '面经 3/7/13' },
  { id: 'mt-new-mq-2', title: 'MQ 消息幂等性', content: 'MQ 如何保证消息不被重复消费？', category: '分布式系统', difficulty: '进阶', referenceAnswer: '唯一消息 ID + 幂等表(消费前查/消费后写)、数据库唯一约束、Redis SETNX、业务状态机(订单状态)。消费失败需回滚幂等标记。RabbitMQ 用 MessageId，Kafka 用 enable.idempotence。', frequency: 'high', source: '面经 3/7/9/13/18' },
  { id: 'mt-new-mq-3', title: 'Kafka vs RabbitMQ 选型', content: 'Kafka 和 RabbitMQ 的差异？什么场景用哪个？', category: '分布式系统', difficulty: '进阶', referenceAnswer: 'Kafka：高吞吐、分区有序、消息持久化，适合大数据/日志/事件流。RabbitMQ：低延迟、灵活路由(Exchange)、AMQP 协议，适合业务消息/RPC。广播功能 RabbitMQ 的 fanout exchange 更原生。', frequency: 'medium', source: '面经 12/21' },
  { id: 'mt-new-mq-4', title: 'Kafka 分区与消费组', content: 'Kafka 主题/分区/消费者/消费组的关系？2 分区 4 消费者会怎样？', category: '分布式系统', difficulty: '进阶', referenceAnswer: 'Topic→多 Partition，ConsumerGroup 内每个 Partition 只被一个消费者消费。2 分区 4 消费者→2 个空闲。1 个消费者→负责 2 个分区。Offset 存储在 __consumer_offsets topic 中。拉模式(poll)消费者控制速率。', frequency: 'medium', source: '面经 9/10/27' },

  // ==================== 计算机网络 ====================
  { id: 'mt-new-net-1', title: 'TCP 三次握手与四次挥手', content: 'TCP 三次握手过程？为什么要三次？四次挥手？', category: '计算机网络', difficulty: '基础', referenceAnswer: '三次握手：SYN→SYN+ACK→ACK，防止历史连接干扰(服务端收到过期 SYN 会建立错误连接)。四次挥手：FIN→ACK→FIN→ACK，全双工需双方各自关闭。TIME_WAIT 2MSL 保证最后 ACK 到达+等待旧报文消失。', frequency: 'high', source: '面经 4/7/24/26/30/31' },
  { id: 'mt-new-net-2', title: 'HTTP vs HTTPS', content: 'HTTP 和 HTTPS 的区别？', category: '计算机网络', difficulty: '基础', referenceAnswer: 'HTTPS = HTTP + TLS/SSL。端口 80 vs 443、明文 vs 加密、HTTPS 需 CA 证书。TLS 握手：非对称加密交换对称密钥(RSA/ECDHE)，后续用对称加密(AES)通信，兼顾安全和性能。', frequency: 'medium', source: '面经 20/24' },
  { id: 'mt-new-net-3', title: '浏览器 URL 访问全流程', content: '从浏览器输入 URL 到页面展示，经历了什么？', category: '计算机网络', difficulty: '进阶', referenceAnswer: 'DNS 解析(递归+迭代)→TCP 三次握手→(TLS 握手)→HTTP 请求→服务器处理(Nginx→应用)→HTTP 响应→浏览器解析(DOM→CSSOM→RenderTree→Layout→Paint→Composite)。', frequency: 'medium', source: '面经 11/22' },
  { id: 'mt-new-net-4', title: 'WebSocket vs HTTP', content: 'WebSocket 和 HTTP 的区别？WS 怎么建立连接？', category: '计算机网络', difficulty: '进阶', referenceAnswer: 'HTTP 请求-响应半双工；WebSocket 全双工持久连接，适合实时推送(聊天/行情/协作)。连接过程：先发 HTTP Upgrade 请求(Connection: Upgrade, Upgrade: websocket)，服务端 101 Switching Protocols 响应后升级。', frequency: 'medium', source: '面经 5' },

  // ==================== 操作系统 ====================
  { id: 'mt-new-os-1', title: '进程 vs 线程', content: '进程和线程的区别？生命周期？', category: '操作系统', difficulty: '基础', referenceAnswer: '进程是资源分配单位(独立地址空间)，线程是调度单位(共享进程资源)。进程：新建→就绪→运行→阻塞→终止。Java 线程：NEW→RUNNABLE→BLOCKED/WAITING/TIMED_WAITING→TERMINATED。线程切换比进程切换开销小(无需切换页表)。', frequency: 'medium', source: '面经 11/18/22' },
  { id: 'mt-new-os-2', title: '进程间通信方式', content: '进程间通信(IPC)有哪些方式？', category: '操作系统', difficulty: '进阶', referenceAnswer: '管道(Pipe/FIFO)、消息队列、共享内存(最快,需信号量同步)、信号量(Semaphore)、信号(Signal)、Socket(跨机器)。面试高频组合：共享内存+信号量。Java 中多进程通信常用 Socket/MQ。', frequency: 'medium', source: '面经 7/11/22/35' },

  // ==================== 分布式 ====================
  { id: 'mt-new-dist-1', title: '分布式锁与宕机处理', content: '分布式锁过期但任务没完成怎么办？宕机后锁怎么释放？', category: '分布式系统', difficulty: '进阶', referenceAnswer: 'Redisson 看门狗(WatchDog)：默认 30s TTL，每 10s 自动续期，解决任务超时问题。宕机释放：key 设了 TTL，客户端宕机后锁自动过期。其他方案：ZooKeeper 临时顺序节点(会话断开自动删除)、etcd lease+watch。', frequency: 'medium', source: '面经 3/6' },
  { id: 'mt-new-dist-2', title: '分布式事务 / Seata', content: '分布式事务了解吗？Seata 的主要模式？', category: '分布式系统', difficulty: '高难', referenceAnswer: 'Seata 四种：AT(自动补偿,最常用,拦截 SQL 生成 undo log)、TCC(Try-Confirm-Cancel)、Saga(长事务编排)、XA(强一致 2PC)。选型：AT 适合大部分场景，TCC 适合高一致性金融场景，Saga 适合长流程。', frequency: 'medium', source: '面经 10/27' },

  // ==================== AI/大模型 ====================
  { id: 'mt-new-ai-1', title: '大模型幻觉与缓解', content: '大模型为什么会产生幻觉？怎么减少？', category: 'AI/大模型', difficulty: '进阶', referenceAnswer: '原因：训练数据噪声、自回归采样的概率性、缺乏事实验证。缓解：RAG 检索增强(外挂知识库)、降低 temperature、Few-shot 示例、Chain-of-Thought、RLHF 对齐、知识 grounding(引用来源)。', frequency: 'medium', source: '面经 5' },
  { id: 'mt-new-ai-2', title: 'Transformer 架构与不足', content: 'Transformer 架构是什么？你认为的不足？', category: 'AI/大模型', difficulty: '进阶', referenceAnswer: '架构：Multi-Head Self-Attention + FFN + Residual + LayerNorm，Encoder-Decoder(GPT只用 Decoder)。不足：自注意力 O(n²) 限制上下文长度、缺乏显式记忆、无法实时学习新知识、计算资源消耗大、对结构化推理弱。', frequency: 'medium', source: '面经 5' },

  // ==================== 场景设计 ====================
  { id: 'mt-new-scene-1', title: '电影院抢票系统设计', content: '设计一个电影院抢票系统，怎么保证并发和公平？', category: '场景题', difficulty: '高难', referenceAnswer: '座位级粒度锁(Redis Hash 每个座位一个 field)，不锁整个电影院。流程：Redis Lua 原子选座+标记 → MQ 削峰 → 后端消费创建订单 → 超时未支付释放座位。公平性：MQ FIFO 保证先到先得。高并发：分段锁+限流。', frequency: 'medium', source: '面经 8' },
  { id: 'mt-new-scene-2', title: '巨量数据读取接口设计', content: '设计一个接口，从 DB 读取巨量数据后操作业务，如何防 OOM？', category: '场景题', difficulty: '进阶', referenceAnswer: '游标(Cursor)分块读取 + 流式处理，避免一次加载。MyBatis fetchSize / ResultHandler 流式查询。多线程并发处理 + CountDownLatch 汇总。考虑背压(backpressure)：消费速度 < 读取速度时暂停读取。', frequency: 'medium', source: '面经 8' },

  // ==================== 手撕算法 ====================
  { id: 'mt-new-algo-1', title: '最小覆盖子串 (LC76)', content: '给定字符串 s 和 t，找 s 中包含 t 所有字符的最短子串', category: '手撕算法', difficulty: '高难', referenceAnswer: '滑动窗口：右指针扩展直到包含 t 所有字符(用 HashMap 记录频次+matched 计数)，然后左指针收缩找最小窗口。O(n) 时间 O(k) 空间。', frequency: 'medium', source: '面经 1/15', tags: ['滑动窗口', 'Hard'] },
  { id: 'mt-new-algo-2', title: '二叉树最大路径和 (LC124)', content: 'LeetCode 124. 二叉树中的最大路径和 (Hard)', category: '手撕算法', difficulty: '高难', referenceAnswer: 'DFS 后序遍历。每个节点计算经过该节点的最大路径和 = val + max(0,左贡献) + max(0,右贡献)，更新全局最大值。向上返回 val + max(0, max(左,右))。初始全局最大值 = INT_MIN。', frequency: 'high', source: '面经 2/14/17/32', tags: ['DFS', 'Hard'] },
  { id: 'mt-new-algo-3', title: '合并区间 (LC56)', content: 'LeetCode 56. 合并区间 (Medium)', category: '手撕算法', difficulty: '进阶', referenceAnswer: '按左端点排序，遍历：当前左端点 ≤ 上一区间右端点则合并(取 max 右端点)，否则新开一个区间。', frequency: 'medium', source: '面经 3/25/35', tags: ['排序', 'Medium'] },
  { id: 'mt-new-algo-4', title: '二叉树锯齿形层序遍历 (LC103)', content: 'LeetCode 103. 二叉树的锯齿形层序遍历', category: '手撕算法', difficulty: '进阶', referenceAnswer: 'BFS 层序遍历，用 boolean 标记当前层方向，奇数层正序偶数层反序(Collections.reverse)。或用 deque 双端插入。', frequency: 'medium', source: '面经 20/25', tags: ['BFS', 'Medium'] },
  { id: 'mt-new-algo-5', title: '链表两数相加 (LC2)', content: 'LeetCode 2. 两数相加', category: '手撕算法', difficulty: '进阶', referenceAnswer: '逐位相加+进位。同时遍历两链表，sum = l1.val + l2.val + carry，新节点 val = sum % 10，carry = sum / 10。注意最后一个进位。', frequency: 'medium', source: '面经 7/13', tags: ['链表', 'Medium'] },
  { id: 'mt-new-algo-6', title: '最长回文子串/子序列 (LC5/516)', content: '最长回文子串和最长回文子序列', category: '手撕算法', difficulty: '进阶', referenceAnswer: '子串 LC5：DP dp[i][j]=s[i..j]是否回文，或中心扩展法 O(n²)。子序列 LC516：DP dp[i][j] = s[i]==s[j] ? dp[i+1][j-1]+2 : max(dp[i+1][j], dp[i][j-1])。', frequency: 'medium', source: '面经 8', tags: ['DP', 'Medium'] },
  { id: 'mt-new-algo-7', title: '比较版本号 (LC165)', content: 'LeetCode 165. 比较版本号', category: '手撕算法', difficulty: '进阶', referenceAnswer: 'split(".") 分段，逐段 parseInt 比较，长度不足补 0。注意前导零处理(parseInt 自动去除)。', frequency: 'low', source: '面经 30', tags: ['字符串', 'Medium'] },
];
