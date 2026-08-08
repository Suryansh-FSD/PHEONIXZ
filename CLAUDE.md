@AGENTS.md

<!-- AICB:BEGIN {"version":1,"target":"CLAUDE.md","generatedAt":"2026-08-08T19:39:01.168Z","hash":"sha256:0759388731f29c976cd56ff65cef2107e6b0ce0623161b01b7421e2a8abaf089"} -->
# AI Context Bridge — Handoff

Workspace: `/Users/suryanshdixit/Desktop/PhoenixZ`

## Spec / context files (read these first)
- `CLAUDE.md` _(spec)_ — Claude Code instructions
- `AGENTS.md` _(spec)_ — Multi-agent instructions
- `README.md` _(spec)_ — Project README
- `.agent/AGENTS.md` _(spec)_ — Multi-agent instructions (.agent)
- `GEMINI.md` _(spec)_ — Gemini instructions
- `AGENT.md` _(spec)_ — Multi-agent instructions
- `.cursorrules` _(spec)_ — Cursor rules
- `.windsurfrules` _(spec)_ — Windsurf rules
- `.github/copilot-instructions.md` _(spec)_ — GitHub Copilot instructions (.github)

## Skills
- **ENABLED** — Dataproc and Spark Integration, ML on Dataproc, Spark Optimizations, gcp_pipeline_resource_provisioning_spec, Pipeline YAML Schema, Bottlenecks and Parallelism Context, Dataflow Diagnostics Reference, dataflow_metrics_bigquery, Core Job Metrics, dataflow_metrics_pubsub, dataflow_metrics_streaming_engine, Dataflow Flex Template - Single Docker Image Configuration, Dataflow Streaming Horizontal Autoscaling Analysis, Streaming Job Health Analysis, BigFrames Code Generation, BigQuery ML (BQML) & AI Functions, BigQuery Optimization, AI.EVALUATE, AI.FORECAST, AI.GENERATE_EMBEDDING, Contribution Analysis, Creating Remote Models, VECTOR_SEARCH, Gemini Data Analytics Chat Integration, Building with React + Vite, Building with Streamlit
- **ASK** — accidental-data-loss-prevention, Definitive Guide to reading and writing tables using spark code, Direct Inspection of table schema, AI.GENERATE_TABLE, Unified Data App Design System

## Skill instructions (excerpts)
_The full content lives at the path shown. Read the source file before invoking._

### Dataproc and Spark Integration _(ENABLED)_
Source: `../../.gemini/skills/gcp-spark/resources/gcloud_dataproc.md`

# Dataproc and Spark Integration
Manage Spark resources on Google Cloud Dataproc Clusters and Serverless,
  including setting up clusters; launching jobs and batches; managing serverless
  session templates, and inspecting outputs.

## Background

Dataproc is Google Cloud's managed service for running Hadoop and Spark
workloads. The two basic flavors are:

-   **Clusters** aka **Dataproc on GCE**: users create a cluster, then submit
    one or more Spark or other jobs. Users have control over the underlying VM
    resources.
-   **Serverless Spark** aka **Dataproc Serverless**, where users do

…_(truncated)_

### ML on Dataproc _(ENABLED)_
Source: `../../.gemini/skills/gcp-spark/resources/ml_tasks.md`

# ML on Dataproc

**Verified patterns** for ML training:
- **XGBoost**: Use `SparkXGBClassifier`
- **Native Spark ML**: `GBTClassifier`, `RandomForestClassifier`,
  `LogisticRegression`

## LightGBM on Dataproc

> [!WARNING]
> **LightGBM has dependency conflicts on Dataproc Serverless.** The SynapseML
> LightGBM wrapper conflicts with Dataproc's internal libraries.

**Alternatives:**
1. **Use XGBoost** — Similar performance, native Spark support.
2. **Use Native Spark ML** — `GBTClassifier` provides similar gradient boosting
3. **Use Vertex AI** — Train LightGBM on Vertex, export model, load

…_(truncated)_

### Spark Optimizations _(ENABLED)_
Source: `../../.gemini/skills/gcp-spark/resources/spark_optimizations.md`

# Spark Optimizations

## Broadcast Joins

When performing a standard join between a large fact table and a tiny dimension
table (lookup table), always use a broadcast hint
`pyspark.sql.functions.broadcast()`. Without it, Spark may perform a heavy
shuffle operation and lead to performance issues or out-of-memory errors.

### gcp_pipeline_resource_provisioning_spec _(ENABLED)_
Source: `../../.gemini/skills/gcp-pipeline-resource-provisioning/references/gcp_pipeline_resource_provisioning_spec.md`

```yaml
environments:
  dev:
    project: {{ project }}
    region: {{ region }}
    variables:
      REPO_NAME: my-repo
      SERVICE_ACCOUNT_EMAIL: "[NAME]@{{ project }}.iam.gserviceaccount.com"
    secrets:
      YOUR_SECRET_NAME: "projects/{{ project }}/secrets/your-secret/versions/latest"
    resources:
      # --- BigQuery ---
      - type: bigquery.dataset
        name: my_dataset
        definition:
          labels:
            env: dev
            datacloud: __REQUIRED_LABEL__
      - type: bigquery.table
        name: my_table
        parent: my_dataset
        definition:

…_(truncated)_

### Pipeline YAML Schema _(ENABLED)_
Source: `../../.gemini/skills/gcp-pipeline-orchestration/references/orchestration-pipelines-schema.md`

# Pipeline YAML Schema
Defines the orchestration pipelines schema using Protocol Buffers.
Field names in YAML should generally be camelCase (e.g., use `pipelineId` for the proto field `pipeline_id`).
However, fields of type `Struct` which represent configuration objects for other systems (e.g., `cluster_config`, `environment_config`, `job`, `workflow_invocation`) must use snake_case in YAML.
## Syntax
/////////////////////////
// Pipeline Models (YAML fields)
////////////////////////
message OrchestrationPipeline {
  string model_version = 1 [(pipeline_models.validation.is_required) = true];

…_(truncated)_

### Bottlenecks and Parallelism Context _(ENABLED)_
Source: `../../.gemini/skills/gcp-dataflow/resources/bottlenecks_and_parallelism_context.md`

# Bottlenecks and Parallelism Context

## 1. Scalability, Keys, and Parallelism

Dataflow Streaming Engine operates on a **per-key processing model** to scale to
tens of millions of messages per second while ensuring exactly-once processing.

### Relevant metrics

Specific metrics to reference in
[resources/dataflow_metrics_streaming_engine](resources/dataflow_metrics_streaming_engine.md)

*   `job/processing_parallelism_keys` for parallelism
*   `job/bundle_user_processing_latencies` for operation processing age,
    indicating slow or stuck processing operations
*

…_(truncated)_

### Dataflow Diagnostics Reference _(ENABLED)_
Source: `../../.gemini/skills/gcp-dataflow/resources/dataflow_diagnostics_reference.md`

# Dataflow Diagnostics Reference

> [!IMPORTANT] To perform a complete Root Cause Analysis (RCA), you MUST get
> **Job Messages/Events** and both **Monitoring** and **Logging** to
> correlate metrics spikes/drops with log errors. Always follow the sample
> queries provided in the below sections.

## 1. Monitoring

### Streaming Jobs

Key metrics to look at for Streaming jobs:

*   **Data Freshness**:
    *   `job/per_stage_data_watermark_age` (Filters: `job_id`, `stage`)
    *   `job/data_watermark_age` (Filters: `job_id`)
*   **Throughput**:
    *   `job/elements_produced_count` (Filters:

…_(truncated)_

### dataflow_metrics_bigquery _(ENABLED)_
Source: `../../.gemini/skills/gcp-dataflow/resources/dataflow_metrics_bigquery.md`

## BigQuery Metrics

*Useful for Evaluating BigQuery sink write failures or delays.*

### `job/bigquery/write_count`

*   **Display Name**: BigQueryIO.Write Requests
*   **Summary**: BigQuery write requests from BigQueryIO.Write in Dataflow jobs.
    Sampled every 60 seconds.
*   **Kind/Type**: DELTA, INT64, 1
*   **Filter Labels**: `status`, `job_id`, `ptransform`, `bigquery_project_id`,
    `bigquery_dataset_id`, `bigquery_table_or_view_id`

## How to use this handoff
1. Read every file under "Spec / context files" before acting.
2. Continue the work described in the most recent thought.
3. Honor skill statuses: `ENABLED` use freely, `ASK` require explicit user confirmation each time, `DISABLED` must not be used.
4. When you reach a non-trivial decision, append a thought to `.aicb/state.json` (modelId + text + sourceReference if relevant).
<!-- AICB:END -->
